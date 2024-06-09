const Camunda = require("../camunda");
const Order = require("../models/Order");

module.exports = class OrderService {
  static async create(tableId) {
    const data = await Camunda.createNarudzba();

    const res = await Order.create(tableId, data.id, data.definitionId);

    await Camunda.completeNextTask(data.id);

    return res;
  }

  static async save(order_id) {
    const order = await Order.get(order_id);

    await Order.save(order_id);

    await Camunda.completeNextTask(order.cam_id, {
      variables: { giveUp: { value: "no" } },
    });
  }

  static async take(order_id) {
    const order = await Order.get(order_id);

    await Order.take(order_id);

    await Camunda.sendAcceptOrderMessage(order.cam_id);
  }

  static async deliver(order_id) {
    const order = await Order.get(order_id);

    await Order.deliver(order_id);

    await Camunda.completeNextTask(order.cam_id);
  }

  static async markPaid(order_id) {
    const order = await Order.get(order_id);

    await Order.markPaid(order_id);

    await Camunda.completeNextTask(order.cam_id);
  }

  static async delete(order_id) {
    const order = await Order.get(order_id);

    await Camunda.completeNextTask(order.cam_id, {
      variables: { giveUp: { value: "yes" } },
    });

    await Order.delete(order_id);

    await Camunda.completeNextTask(order.cam_id);
  }
};
