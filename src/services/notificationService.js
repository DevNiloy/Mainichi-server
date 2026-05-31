const nodemailer = require("nodemailer");

// 📧 Nodemailer Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// --- ১. User-er kache Confirmation Email ---
exports.sendUserConfirmationEmail = async (userEmail, orderDetails) => {
  const mailOptions = {
    from: `"Japan Halal Food" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: "Order Placed Successfully! ✅",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="background: #1F5E3B; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
             <h2 style="color: #fff; margin: 0;">Assalamu Alaikum!</h2>
        </div>
        <div style="padding: 20px; border: 1px solid #eee; border-radius: 0 0 10px 10px;">
          <p>Thank you for your order at <strong>Japan Halal Food</strong>.</p>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p style="margin: 5px 0;"><strong>Order ID:</strong> ${orderDetails._id}</p>
            <p style="margin: 5px 0;"><strong>Total Amount:</strong> <span style="color: #1F5E3B; font-weight: bold;">¥${orderDetails.totalPrice.toLocaleString()}</span></p>
          </div>
          <p>We are currently processing your order. You will be notified once it is confirmed.</p>
          <br/>
          <p>Best Regards,<br/><strong>Japan Halal Food Team</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Confirmation email sent to User: ${userEmail}`);
  } catch (err) {
    console.error("❌ User Email Error:", err.message);
  }
};

// --- ২. Admin-er kache Notified Email ---
exports.sendAdminNotificationEmail = async (orderDetails) => {
  console.log("===== ORDER DETAILS =====");
  console.log(JSON.stringify(orderDetails, null, 2));
  // .env theke admin email nichche, na thakle default ekti thakbe
  console.log(process.env.ADMIN_EMAIL, "admin mail");
  const adminEmail = process.env.ADMIN_EMAIL;

  const itemsList = orderDetails.orderItems
    .map(
      (item) => `
      <tr>
        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          <img
            src="${item.image}"
            alt="${item.name}"
            width="70"
            height="70"
            style="border-radius:8px;object-fit:cover;"
          />
        </td>

        <td style="padding:10px;border:1px solid #ddd;">
          ${item.name}
        </td>

        <td style="padding:10px;border:1px solid #ddd;text-align:center;">
          ${item.qty}
        </td>

        <td style="padding:10px;border:1px solid #ddd;text-align:right;">
          ¥${item.price.toLocaleString()}
        </td>

        <td style="padding:10px;border:1px solid #ddd;text-align:right;">
          ¥${(item.qty * item.price).toLocaleString()}
        </td>
      </tr>
    `,
    )
    .join("");

  const mailOptions = {
    from: `"Japan Halal Server" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: "🚀 New Order Received!",
    html: `
<div style="font-family:Arial,sans-serif;background:#f5f7fa;padding:20px;">

  <div style="max-width:900px;margin:auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.08);">

    <div style="background:#1F5E3B;padding:25px;color:#fff;">
      <h2 style="margin:0;">🚀 New Order Received</h2>
      <p style="margin-top:8px;">
        A new customer has placed an order.
      </p>
    </div>

    <div style="padding:25px;">

      <h3 style="color:#1F5E3B;margin-top:0;">
        📦 Order Information
      </h3>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;"><strong>Order ID</strong></td>
          <td style="padding:8px;">${orderDetails._id}</td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>Status</strong></td>
          <td style="padding:8px;">${orderDetails.status}</td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>Payment Method</strong></td>
          <td style="padding:8px;">${orderDetails.paymentMethod}</td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>Order Date</strong></td>
          <td style="padding:8px;">
            ${new Date(orderDetails.createdAt).toLocaleString()}
          </td>
        </tr>
      </table>

      <hr style="margin:25px 0;">

      <h3 style="color:#1F5E3B;">
        📍 Customer Information
      </h3>

      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:8px;"><strong>Phone</strong></td>
          <td style="padding:8px;">
            ${orderDetails.shippingAddress.phone}
          </td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>Address</strong></td>
          <td style="padding:8px;">
            ${orderDetails.shippingAddress.address}
          </td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>City</strong></td>
          <td style="padding:8px;">
            ${orderDetails.shippingAddress.city}
          </td>
        </tr>

        <tr>
          <td style="padding:8px;"><strong>Postal Code</strong></td>
          <td style="padding:8px;">
            ${orderDetails.shippingAddress.postalCode}
          </td>
        </tr>
      </table>

      <hr style="margin:25px 0;">

      <h3 style="color:#1F5E3B;">
        🛒 Ordered Products
      </h3>

      <table
        style="
          width:100%;
          border-collapse:collapse;
          margin-top:15px;
        "
      >
        <thead>
          <tr style="background:#f7f7f7;">
            <th style="padding:12px;border:1px solid #ddd;">Image</th>
            <th style="padding:12px;border:1px solid #ddd;">Product</th>
            <th style="padding:12px;border:1px solid #ddd;">Qty</th>
            <th style="padding:12px;border:1px solid #ddd;">Price</th>
            <th style="padding:12px;border:1px solid #ddd;">Subtotal</th>
          </tr>
        </thead>

        <tbody>
          ${itemsList}
        </tbody>
      </table>

      <div
        style="
          margin-top:25px;
          background:#f0fff4;
          padding:20px;
          border-radius:10px;
          text-align:right;
        "
      >
        <h2 style="margin:0;color:#1F5E3B;">
          Grand Total: ¥${orderDetails.totalPrice.toLocaleString()}
        </h2>
      </div>

    </div>

    <div
      style="
        background:#fafafa;
        padding:15px;
        text-align:center;
        font-size:12px;
        color:#777;
      "
    >
      This email was generated automatically by Japan Halal Food.
    </div>

  </div>

</div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("🚀 Notification email sent to Admin.");
  } catch (err) {
    console.error("❌ Admin Email Error:", err.message);
  }
};
