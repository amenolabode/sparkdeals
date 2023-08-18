import emailjs from "@emailjs/browser";

export const sendEmail = (userName, userEmail, selectedProducts, totalValue, userPhone, userAddress) => {
  const generateEmailMessage = () => {
    let message = "Order Details:\n";
    selectedProducts.forEach((product) => {
      message += `
          ${product.productName} - ${product.value} ${product.measurement}
        
      `;
    });

    message += `\nTotal: GH₵ ${totalValue}\n
    
    `;

    message += `\nBuyer Details\n`;
    message += `\nName ${userName}\n`;
    message += `\nEmail: ${userEmail}\n`;
    message += `\nPhone: ${userPhone}\n`;
    message += `\nDelivery Address: ${userAddress}\n`;

    return message;
  };

  const emailData = {
    user_name: userName,
    user_email: userEmail,
    message: generateEmailMessage(),
  }; 

  return emailjs.send(
    "service_vtcz456",
    "template_zco880e",
    emailData,
    "tmnsvtTFyEkOyaF5Q"
  );
};
