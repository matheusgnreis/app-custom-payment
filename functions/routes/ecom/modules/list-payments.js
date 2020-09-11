exports.post = ({ appSdk }, req, res) => {
  const { params, application } = req.body
  const config = Object.assign({}, application.hidden_data, application.data)

  // start mounting response body
  // https://apx-mods.e-com.plus/api/v1/list_payments/response_schema.json?store_id=100
  const response = {
    payment_gateways: []
  }

  const amount = params.amount || {}
  if (!amount.discount || config.cumulative_discount !== false) {
    // calculate discount value
    const { discount } = config
    if (discount && discount.value > 0) {
      if (discount.apply_at !== 'freight') {
        // default discount option
        const { value } = discount
        response.discount_option = {
          label: config.discount_option_label,
          value
        }
        // specify the discount type and min amount is optional
        ;['type', 'min_amount'].forEach(prop => {
          if (discount[prop]) {
            response.discount_option[prop] = discount[prop]
          }
        })
      }
    }
  }

  if (config.payment_options && config.payment_options.length) {
    config.payment_options.forEach(paymentOption => {
      if (paymentOption.zip_range) {
        // payment option for specific addresses only
        const { customer } = params
        if (customer && customer.addresses) {
          const address = customer.addresses.find(addr => addr.default) || customer.addresses[0]
          const zip = address && address.zip
          if (zip && (paymentOption.zip_range.min > zip || paymentOption.zip_range.max < zip)) {
            // zip code condition not satisfied
            return
          }
        }
      }

      const { label, icon, text, discount, enabled } = paymentOption
      if (enabled !== false) {
        if (paymentOption.min_amount && (amount.total < paymentOption.min_amount)) {
          return
        }

        response.payment_gateways.push({
          label,
          icon,
          text,
          discount,
          payment_method: paymentOption.payment_method,
          type: 'payment'
        })
      }
    })
  }

  return res.send(response)
}
