exports.post = ({ appSdk }, req, res) => {
  const { params, application } = req.body
  const { amount } = params
  const config = Object.assign({}, application.data)

  let paymentName = params.payment_method.name
  if (/[a-zA-Z]_[0-9]+/.test(params.payment_method.name)) {
    paymentName = paymentName.split('_')[0]
  }

  let note = params.payment_method.name
  if (config.payment_options) {
    const paymentMethod = config.payment_options.find(option =>
      (option.payment_method && (option.payment_method.name === paymentName && option.payment_method.code === params.payment_method.code))
    )
    note = paymentMethod.text
  }

  const transaction = {
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
    notes: String(note).substr(0, 255)
  }

  const payload = {
    redirect_to_payment: false,
    transaction
  }

  res.send(payload)
}
