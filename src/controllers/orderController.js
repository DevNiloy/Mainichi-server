const orderService = require("../services/orderService");

exports.placeOrder = async (req, res, next) => {
  try {
    const { orderItems } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ⚡ Service call korlei save + notification hoye jabe
    const savedOrder = await orderService.createOrderService(
      req.body,
      req.user._id,
    );

    res.status(201).json({
      success: true,
      status: 201,
      message: "Order placed successfully!",
      data: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};
