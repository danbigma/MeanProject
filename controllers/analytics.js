const moment = require('moment');
const Order = require('../models/Order');
const errorHandler = require('../utils/errorHandler');

// Общая функция для получения заказов пользователя
async function getUserOrders(userId) {
  return await Order.find({ user: userId }).sort({ date: 1 });
}

// Функция для создания JSON-ответа
function createJsonResponse(gain, orders) {
  return {
    gain: {
      percent: Math.abs(gain.percent),
      compare: Math.abs(gain.compare),
      yesterday: gain.yesterday,
      isHigher: gain.percent > 0
    },
    orders: {
      percent: Math.abs(orders.percent),
      compare: Math.abs(orders.compare),
      yesterday: orders.yesterday,
      isHigher: orders.percent > 0
    }
  };
}

// Функция для группировки заказов по датам
function getOrdersMap(orders = []) {
  const daysOrders = {};
  const todayFormatted = moment().format('DD.MM.YYYY');

  orders.forEach(order => {
    const date = moment(order.date).format('DD.MM.YYYY');
    if (date === todayFormatted) {
      return;
    }

    if (!daysOrders[date]) {
      daysOrders[date] = [];
    }

    daysOrders[date].push(order);
  });

  return daysOrders;
}

// Функция для расчета общей суммы заказов
function calculatePrice(orders = []) {
  return orders.reduce((total, order) => {
    return total + order.list.reduce((orderTotal, item) => {
      return orderTotal + item.cost * item.quantity;
    }, 0);
  }, 0);
}

// Контроллер overview
module.exports.overview = async function(req, res) {
  try {
    const allOrders = await getUserOrders(req.user.id);
    const ordersMap = getOrdersMap(allOrders);

    const yesterdayFormatted = moment().add(-1, 'days').format('DD.MM.YYYY');
    const yesterdayOrders = ordersMap[yesterdayFormatted] || [];

    // Количество заказов вчера
    const yesterdayOrdersNumber = yesterdayOrders.length;

    // Общее количество заказов
    const totalOrdersNumber = allOrders.length;

    // Количество дней
    const daysNumber = Object.keys(ordersMap).length;

    // Заказов в день
    const ordersPerDay = (totalOrdersNumber / daysNumber).toFixed(0);

    // Процент для количества заказов
    const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2);

    // Общая выручка
    const totalGain = calculatePrice(allOrders);

    // Выручка в день
    const gainPerDay = (totalGain / daysNumber).toFixed(2);

    // Выручка за вчера
    const yesterdayGain = calculatePrice(yesterdayOrders);

    // Процент выручки
    const gainPercent = (((yesterdayGain / gainPerDay) - 1) * 100).toFixed(2);

    // Структура ответа
    const response = createJsonResponse({
      percent: gainPercent,
      compare: (yesterdayGain - gainPerDay).toFixed(2),
      yesterday: yesterdayGain
    }, {
      percent: ordersPercent,
      compare: (yesterdayOrdersNumber - ordersPerDay).toFixed(2),
      yesterday: yesterdayOrdersNumber
    });

    res.status(200).json(response);

  } catch (e) {
    errorHandler(res, e);
  }
}


// Контроллер analytics
module.exports.analytics = async function(req, res) {
  try {
    const allOrders = await getUserOrders(req.user.id);
    const ordersMap = getOrdersMap(allOrders);

    const average = +(calculatePrice(allOrders) / Object.keys(ordersMap).length).toFixed(2);

    const chart = Object.keys(ordersMap).map(label => {
      const gain = calculatePrice(ordersMap[label]);
      const order = ordersMap[label].length;

      return { label, order, gain };
    });

    res.status(200).json({ average, chart });

  } catch (e) {
    errorHandler(res, e);
  }
}
