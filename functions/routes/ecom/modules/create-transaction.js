exports.post = ({ appSdk }, req, res) => {
  const { params, application } = req.body
  const { amount, buyer } = params
  const config = Object.assign({}, application.data)

  let paymentMethodName = params.payment_method.name
  if (paymentMethodName) {
    paymentMethodName = paymentMethodName.split(' ::')[0]
  }

  let notes, paymentLink
  if (config.payment_options) {
    const paymentOption = config.payment_options.find(paymentOption => {
      return paymentOption.payment_method &&
        paymentOption.payment_method.name === paymentMethodName &&
        paymentOption.payment_method.code === params.payment_method.code
    })
    if (typeof paymentOption.text === 'string') {
      notes = paymentOption.text.substr(0, 255)
    }
    if (typeof paymentOption.payment_link === 'string' && paymentOption.payment_link) {
      paymentLink = paymentOption.payment_link
        .replace(/{amount}/g, amount.total.toFixed(2).replace('.', ','))
        .replace(/{email}/g, buyer.email)
    }
  }

  const transaction = {
    payment_link: paymentLink,
    intermediator: {
      payment_method: params.payment_method
    },
    currency_id: params.currency_id,
    currency_symbol: params.currency_symbol,
    amount: amount.total,
    status: {
      current: 'pending'
    },
    flags: [
      'app-custom-payments'
    ],
    notes
  }

  const payload = {
    redirect_to_payment: Boolean(paymentLink),
    transaction
  }

  res.send(payload)
}
