/* eslint-disable comma-dangle, no-multi-spaces */

/**
 * Edit base E-Com Plus Application object here.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/applications/
 */

const app = {
  app_id: 108091,
  title: 'Pagamento personalizado',
  slug: 'custom-payment',
  type: 'external',
  state: 'active',
  authentication: false,
  /**
   * Uncomment modules above to work with E-Com Plus Mods API on Storefront.
   * Ref.: https://developers.e-com.plus/modules-api/
   */
  modules: {
    /**
     * Triggered to calculate shipping options, must return values and deadlines.
     * Start editing `routes/ecom/modules/calculate-shipping.js`
     */
    // calculate_shipping:   { enabled: true },

    /**
     * Triggered to validate and apply discount value, must return discount and conditions.
     * Start editing `routes/ecom/modules/apply-discount.js`
     */
    // apply_discount:       { enabled: true },

    /**
     * Triggered when listing payments, must return available payment methods.
     * Start editing `routes/ecom/modules/list-payments.js`
     */
    list_payments: {
      enabled: true
    },

    /**
     * Triggered when order is being closed, must create payment transaction and return info.
     * Start editing `routes/ecom/modules/create-transaction.js`
     */
    create_transaction: {
      enabled: true
    }
  },

  /**
   * Uncomment only the resources/methods your app may need to consume through Store API.
   */
  auth_scope: {
    procedures: [
      //  'POST'           // Create procedures to receive webhooks
    ],
    products: [
      // 'GET',           // Read products with public and private fields
      // 'POST',          // Create products
      // 'PATCH',         // Edit products
      // 'PUT',           // Overwrite products
      // 'DELETE',        // Delete products
    ],
    brands: [
      // 'GET',           // List/read brands with public and private fields
      // 'POST',          // Create brands
      // 'PATCH',         // Edit brands
      // 'PUT',           // Overwrite brands
      // 'DELETE',        // Delete brands
    ],
    categories: [
      // 'GET',           // List/read categories with public and private fields
      // 'POST',          // Create categories
      // 'PATCH',         // Edit categories
      // 'PUT',           // Overwrite categories
      // 'DELETE',        // Delete categories
    ],
    customers: [
      // 'GET',           // List/read customers
      // 'POST',          // Create customers
      // 'PATCH',         // Edit customers
      // 'PUT',           // Overwrite customers
      // 'DELETE',        // Delete customers
    ],
    orders: [
      // 'GET',           // List/read orders with public and private fields
      // 'POST',          // Create orders
      // 'PATCH',         // Edit orders
      // 'PUT',           // Overwrite orders
      // 'DELETE',        // Delete orders
    ],
    carts: [
      // 'GET',           // List all carts (no auth needed to read specific cart only)
      // 'POST',          // Create carts
      // 'PATCH',         // Edit carts
      // 'PUT',           // Overwrite carts
      // 'DELETE',        // Delete carts
    ],

    /**
     * Prefer using 'fulfillments' and 'payment_history' subresources to manipulate update order status.
     */
    'orders/fulfillments': [
      // 'GET',           // List/read order fulfillment and tracking events
      // 'POST',          // Create fulfillment event with new status
      // 'DELETE',        // Delete fulfillment event
    ],
    'orders/payments_history': [
      // 'GET',           // List/read order payments history events
      // 'POST',          // Create payments history entry with new status
      // 'DELETE',        // Delete payments history entry
    ],

    /**
     * Set above 'quantity' and 'price' subresources if you don't need access for full product document.
     * Stock and price management only.
     */
    'products/quantity': [
      // 'GET',           // Read product available quantity
      // 'PUT',           // Set product stock quantity
    ],
    'products/variations/quantity': [
      // 'GET',           // Read variaton available quantity
      // 'PUT',           // Set variation stock quantity
    ],
    'products/price': [
      // 'GET',           // Read product current sale price
      // 'PUT',           // Set product sale price
    ],
    'products/variations/price': [
      // 'GET',           // Read variation current sale price
      // 'PUT',           // Set variation sale price
    ],

    /**
     * You can also set any other valid resource/subresource combination.
     * Ref.: https://developers.e-com.plus/docs/api/#/store/
     */
  },

  admin_settings: {
    payment_options: {
      schema: {
        type: 'array',
        title: 'Opções de pagamento customizadas',
        description: 'Configure e oferença novas opções que pagamento em sua loja',
        uniqueItems: true,
        items: {
          type: 'object',
          required: ['label', 'payment_method', 'enabled'],
          properties: {
            label: {
              type: 'string',
              maxLength: 50,
              title: 'Rótulo',
              description: 'Nome da forma de pagamento exibido para os clientes'
            },
            text: {
              type: 'string',
              maxLength: 1000,
              description: 'Texto auxiliar para forma que pagamento, pode-se usar tags HTML',
              title: 'Descrição'
            },
            icon: {
              type: 'string',
              maxLength: 255,
              format: 'uri',
              description: 'URL para ícone da forma de pagamento',
              title: 'Ícone'
            },
            payment_link: {
              type: 'string',
              maxLength: 255,
              format: 'uri',
              description: 'URL de redirecionamento para pagamento, pode-se usar as variáveis {amount} e {email}',
              title: 'Link de pagamento'
            },
            payment_method: {
              type: 'object',
              required: ['code'],
              additionalProperties: false,
              properties: {
                code: {
                  type: 'string',
                  enum: [
                    'credit_card',
                    'account_deposit',
                    'debit_card',
                    'balance_on_intermediary',
                    'loyalty_points',
                    'other'
                  ],
                  title: 'Código do método de pagamento'
                },
                name: {
                  type: 'string',
                  maxLength: 200,
                  title: 'Nome do método de pagamento',
                  description: 'Evite repetir o nome entre as opções de pagamento cadastradas'
                }
              },
              title: 'Método de pagamento'
            },
            discount: {
              type: 'object',
              required: ['value'],
              additionalProperties: false,
              properties: {
                apply_at: {
                  type: 'string',
                  enum: ['total', 'subtotal', 'freight'],
                  default: 'subtotal',
                  description: 'Em qual valor o desconto deverá ser aplicado no checkout'
                },
                type: {
                  type: 'string',
                  enum: ['percentage', 'fixed'],
                  default: 'percentage',
                  description: 'Valor percentual ou fixo a ser descontado, dependendo to tipo configurado'
                },
                value: {
                  type: 'number',
                  minimum: -99999999,
                  maximum: 99999999,
                  description: 'Valor do desconto'
                }
              },
              title: 'Desconto'
            },
            cumulative_discount: {
              type: 'boolean',
              default: true,
              title: 'Desconto cumulativo',
              description: 'Se a promoção poderá ser aplicada junto a cupons e campanhas de desconto'
            },
            min_amount: {
              type: 'integer',
              minimum: 1,
              maximum: 999999999,
              description: 'Valor mínimo para habilitar forma de pagamento',
              title: 'Valor mínimo'
            },
            zip_range: {
              title: 'Faixa de CEP',
              description: 'Limitar forma de pagamento por endereço do cliente',
              type: 'object',
              required: ['min', 'max'],
              properties: {
                min: {
                  type: 'integer',
                  minimum: 10000,
                  maximum: 999999999,
                  title: 'CEP inicial'
                },
                max: {
                  type: 'integer',
                  minimum: 10000,
                  maximum: 999999999,
                  title: 'CEP final'
                }
              }
            },
            enabled: {
              type: 'boolean',
              title: 'Habilitado',
              default: true
            },
            installments_option: {
              schema: {
                type: 'object',
                required: [
                  'max_number'
                ],
                additionalProperties: false,
                properties: {
                  min_installment: {
                    type: 'number',
                    minimum: 1,
                    maximum: 99999999,
                    default: 5,
                    title: 'Parcela mínima',
                    description: 'Valor mínimo da parcela'
                  },
                  max_number: {
                    type: 'integer',
                    minimum: 2,
                    maximum: 999,
                    title: 'Máximo de parcelas',
                    description: 'Número máximo de parcelas (como configurado na conta Mercado Pago)'
                  },
                  monthly_interest: {
                    type: 'number',
                    minimum: 0,
                    maximum: 9999,
                    default: 0,
                    title: 'Juros mensais',
                    description: 'Taxa de juros mensal, zero para parcelamento sem juros'
                  }
                },
                title: 'Parcelamento padrão',
                description: 'Opção de parcelamento equivalente à configuração em sua conta Mercado Pago'
              },
              hide: false
            },
            installments: {
              schema: {
                title: 'Opções de parcelamento',
                description: 'Parcelamento disponível na sua conta MP (preenchimento opcional)',
                type: 'array',
                maxItems: 50,
                items: {
                  title: 'Opção de parcelamento',
                  type: 'object',
                  required: [
                    'number',
                    'interest'
                  ],
                  additionalProperties: false,
                  properties: {
                    number: {
                      type: 'integer',
                      minimum: 2,
                      maximum: 999,
                      description: 'Número de parcelas'
                    },
                    interest: {
                      type: 'number',
                      minimum: 0,
                      maximum: 9999,
                      default: 0,
                      title: 'Taxa de juros',
                      description: 'Juros percentual total, zero para sem juros'
                    }
                  }
                }
              },
              hide: false
            }
          }
        }
      },
      hide: false
    }
  }
}

/**
 * List of Procedures to be created on each store after app installation.
 * Ref.: https://developers.e-com.plus/docs/api/#/store/procedures/
 */

const procedures = []

/**
 * Uncomment and edit code above to configure `triggers` and receive respective `webhooks`:

const { baseUri } = require('./__env')

procedures.push({
  title: app.title,

  triggers: [
    // Receive notifications when new order is created:
    {
      resource: 'orders',
      action: 'create',
    },

    // Receive notifications when order financial/fulfillment status changes:
    {
      resource: 'orders',
      field: 'financial_status',
    },
    {
      resource: 'orders',
      field: 'fulfillment_status',
    },

    // Receive notifications when products/variations stock quantity changes:
    {
      resource: 'products',
      field: 'quantity',
    },
    {
      resource: 'products',
      subresource: 'variations',
      field: 'quantity'
    },

    // Receive notifications when cart is edited:
    {
      resource: 'carts',
      action: 'change',
    },

    // Receive notifications when customer is deleted:
    {
      resource: 'customers',
      action: 'delete',
    },

    // Feel free to create custom combinations with any Store API resource, subresource, action and field.
  ],

  webhooks: [
    {
      api: {
        external_api: {
          uri: `${baseUri}/ecom/webhook`
        }
      },
      method: 'POST'
    }
  ]
})

 * You may also edit `routes/ecom/webhook.js` to treat notifications properly.
 */

exports.app = app

exports.procedures = procedures
