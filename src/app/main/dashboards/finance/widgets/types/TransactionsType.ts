const transactionsWidgetType = [
  {
    type: 'ASAAS_CARD_RECHARGE',
    name: 'Recarga de cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_RECHARGE_REVERSAL',
    name: 'Estorno da recarga de cartão'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION',
    name: 'Transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_CASHBACK',
    name: 'Cashback recebido com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_FEE',
    name: 'Taxa para transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_FEE_REFUND',
    name: 'Estorno de taxa para transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_PARTIAL_REFUND',
    name: 'Estorno parcial de transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_PARTIAL_REFUND_CANCELLATION',
    name: 'Cancelamento do estorno parcial de transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_REFUND',
    name: 'Estorno de transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_TRANSACTION_REFUND_CANCELLATION',
    name: 'Cancelamento do estorno de transação efetuada com o cartão Asaas'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_ANTICIPATION_FEE_REFUND',
    name: 'Estorno taxa de Parcelamento ASAAS Money'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_COMPROMISED_BALANCE',
    name: 'Bloqueio de saldo comprometido com pagamento Asaas Money'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_COMPROMISED_BALANCE_REFUND',
    name: 'Cancelamento do bloqueio de saldo comprometido com pagamento Asaas Money'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_FINANCING_FEE',
    name: 'Taxa de financiamento ASAAS Money'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_FINANCING_FEE_REFUND',
    name: 'Estorno taxa de financiamento ASAAS Money'
  },
  {
    type: 'ASAAS_MONEY_TRANSACTION_CASHBACK',
    name: 'Cashback - ASAAS MONEY'
  },
  {
    type: 'ASAAS_MONEY_TRANSACTION_CASHBACK_REFUND',
    name: 'Estorno de cashback - ASAAS MONEY'
  },
  {
    type: 'ASAAS_MONEY_TRANSACTION_CHARGEBACK',
    name: 'Chargeback transação Asaas Money'
  },
  {
    type: 'ASAAS_MONEY_TRANSACTION_CHARGEBACK_REVERSAL',
    name: 'Estorno chargeback transação Asaas Money'
  },
  {
    type: 'BILL_PAYMENT',
    name: 'Pagamento de conta'
  },
  {
    type: 'BILL_PAYMENT_CANCELLED',
    name: 'Cancelamento do pagamento de conta'
  },
  {
    type: 'BILL_PAYMENT_REFUNDED',
    name: 'Estorno do pagamento de conta'
  },
  {
    type: 'BILL_PAYMENT_FEE',
    name: 'Taxa de pagamento de conta'
  },
  {
    type: 'BILL_PAYMENT_FEE_CANCELLED',
    name: 'Cancelamento da taxa de pagamento de conta'
  },
  {
    type: 'CHARGEBACK',
    name: 'Bloqueio de saldo devido ao chargeback de cobrança'
  },
  {
    type: 'CHARGEBACK_REVERSAL',
    name: 'Cancelamento do bloqueio de saldo devido ao chargeback'
  },
  {
    type: 'CHARGED_FEE_REFUND',
    name: 'Estorno da taxa para negativação da cobrança ou Pix'
  },
  {
    type: 'CONTRACTUAL_EFFECT_SETTLEMENT',
    name: 'Valor em recebíveis reservado'
  },
  {
    type: 'CONTRACTUAL_EFFECT_SETTLEMENT_REVERSAL',
    name: 'Estorno do valor em recebíveis reservado'
  },
  {
    type: 'CREDIT',
    name: 'Crédito'
  },
  {
    type: 'CREDIT_BUREAU_REPORT',
    name: 'Taxa de consulta Serasa'
  },
  {
    type: 'CUSTOMER_COMMISSION_SETTLEMENT_CREDIT',
    name: 'Crédito de liquidação de comissão de parceiros'
  },
  {
    type: 'CUSTOMER_COMMISSION_SETTLEMENT_DEBIT',
    name: 'Débito de liquidação de comissão de parceiros'
  },
  {
    type: 'DEBIT',
    name: 'Débito'
  },
  {
    type: 'DEBIT_REVERSAL',
    name: 'Estorno de débito'
  },
  {
    type: 'DEBT_RECOVERY_NEGOTIATION_FINANCIAL_CHARGES',
    name: 'Encargos sobre renegociação'
  },
  {
    type: 'FREE_PAYMENT_USE',
    name: 'Estorno por campanha promocional na tarifa'
  },
  {
    type: 'INTERNAL_TRANSFER_CREDIT',
    name: 'Transferência da conta Asaas'
  },
  {
    type: 'INTERNAL_TRANSFER_DEBIT',
    name: 'Transferência para a conta Asaas'
  },
  {
    type: 'INTERNAL_TRANSFER_REVERSAL',
    name: 'Estorno de transferência para a conta Asaas'
  },
  {
    type: 'INVOICE_FEE',
    name: 'Taxa de emissão da nota fiscal de serviço'
  },
  {
    type: 'PARTIAL_PAYMENT',
    name: 'Cobrança parcialmente recebida'
  },
  {
    type: 'PAYMENT_DUNNING_CANCELLATION_FEE',
    name: 'Taxa para cancelamento de negativação de cobrança'
  },
  {
    type: 'PAYMENT_DUNNING_RECEIVED_FEE',
    name: 'Taxa para negativação de cobrança'
  },
  {
    type: 'PAYMENT_DUNNING_RECEIVED_IN_CASH_FEE',
    name: 'Taxa para negativação em dinheiro de cobrança'
  },
  {
    type: 'PAYMENT_DUNNING_REQUEST_FEE',
    name: 'Taxa para negativação de cobrança'
  },
  {
    type: 'PAYMENT_FEE',
    name: 'Taxa de boleto, cartão ou Pix'
  },
  {
    type: 'PAYMENT_FEE_REVERSAL',
    name: 'Estorno da taxa de boleto, cartão ou Pix'
  },
  {
    type: 'PAYMENT_MESSAGING_NOTIFICATION_FEE',
    name: 'Taxa de mensageria de fatura'
  },
  {
    type: 'PAYMENT_RECEIVED',
    name: 'Cobrança recebida'
  },
  {
    type: 'PAYMENT_CUSTODY_BLOCK',
    name: 'Bloqueio de saldo por custódia'
  },
  {
    type: 'PAYMENT_CUSTODY_BLOCK_REVERSAL',
    name: 'Desbloqueio de saldo por custódia'
  },
  {
    type: 'PAYMENT_REFUND_CANCELLED',
    name: 'Cancelamento do estorno de fatura'
  },
  {
    type: 'PAYMENT_REVERSAL',
    name: 'Estorno de fatura'
  },
  {
    type: 'PAYMENT_SMS_NOTIFICATION_FEE',
    name: 'Taxa de notificação por SMS de cobrança'
  },
  {
    type: 'PAYMENT_INSTANT_TEXT_MESSAGE_FEE',
    name: 'Taxa de notificação por mensagem instantânea de cobrança'
  },
  {
    type: 'PHONE_CALL_NOTIFICATION_FEE',
    name: 'Taxa de notificação por voz'
  },
  {
    type: 'PIX_TRANSACTION_CREDIT',
    name: 'Transferência via Pix recebida'
  },
  {
    type: 'PIX_TRANSACTION_CREDIT_FEE',
    name: 'Taxa de transferência Pix recebida'
  },
  {
    type: 'PIX_TRANSACTION_CREDIT_REFUND',
    name: 'Estorno de recebimento via Pix'
  },
  {
    type: 'PIX_TRANSACTION_CREDIT_REFUND_CANCELLATION',
    name: 'Cancelamento de estorno de recebimento via Pix'
  },
  {
    type: 'PIX_TRANSACTION_DEBIT',
    name: 'Transação via Pix'
  },
  {
    type: 'PIX_TRANSACTION_DEBIT_FEE',
    name: 'Taxa para Pix'
  },
  {
    type: 'PIX_TRANSACTION_DEBIT_REFUND',
    name: 'Estorno de transação via Pix'
  },
  {
    type: 'POSTAL_SERVICE_FEE',
    name: 'Taxa de envio de boletos via Correios'
  },
  {
    type: 'PRODUCT_INVOICE_FEE',
    name: 'Taxa de emissão da nota fiscal de produto emitida via Base ERP'
  },
  {
    type: 'CONSUMER_INVOICE_FEE',
    name: 'Taxa de emissão da nota fiscal de consumidor emitida via Base ERP'
  },
  {
    type: 'PROMOTIONAL_CODE_CREDIT',
    name: 'Desconto na taxa'
  },
  {
    type: 'PROMOTIONAL_CODE_DEBIT',
    name: 'Estorno do desconto na taxa'
  },
  {
    type: 'RECEIVABLE_ANTICIPATION_GROSS_CREDIT',
    name: 'Antecipação de parcelamento ou cobrança'
  },
  {
    type: 'RECEIVABLE_ANTICIPATION_DEBIT',
    name: 'Baixa da parcela ou antecipação'
  },
  {
    type: 'RECEIVABLE_ANTICIPATION_FEE',
    name: 'Taxa de antecipação de parcelamento ou cobrança'
  },
  {
    type: 'RECEIVABLE_ANTICIPATION_PARTNER_SETTLEMENT',
    name: 'Baixa da parcela ou antecipação'
  },
  {
    type: 'REFUND_REQUEST_CANCELLED',
    name: 'Cancelamento do estorno de fatura'
  },
  {
    type: 'REFUND_REQUEST_FEE',
    name: 'Taxa de realização de estorno de fatura'
  },
  {
    type: 'REFUND_REQUEST_FEE_REVERSAL',
    name: 'Cancelamento da taxa de realização de estorno de fatura'
  },
  {
    type: 'REVERSAL',
    name: 'Estorno'
  },
  {
    type: 'TRANSFER',
    name: 'Transferência para conta bancária'
  },
  {
    type: 'TRANSFER_FEE',
    name: 'Taxa de transferência para conta bancária'
  },
  {
    type: 'TRANSFER_REVERSAL',
    name: 'Estorno de transferência para conta bancária'
  },
  {
    type: 'MOBILE_PHONE_RECHARGE',
    name: 'Recarga de celular'
  },
  {
    type: 'REFUND_MOBILE_PHONE_RECHARGE',
    name: 'Estorno de recarga de celular'
  },
  {
    type: 'CANCEL_MOBILE_PHONE_RECHARGE',
    name: 'Cancelamento de recarga de celular'
  },
  {
    type: 'INSTANT_TEXT_MESSAGE_FEE',
    name: 'Taxa de notificação por WhatsApp'
  },
  {
    type: 'ASAAS_CARD_BALANCE_REFUND',
    name: 'Estorno de cartão Asaas'
  },
  {
    type: 'ASAAS_MONEY_PAYMENT_ANTICIPATION_FEE',
    name: 'Taxa de Parcelamento ASAAS Money'
  },
  {
    type: 'BACEN_JUDICIAL_LOCK',
    name: 'Bloqueio Judicial'
  },
  {
    type: 'BACEN_JUDICIAL_UNLOCK',
    name: 'Desbloqueio Judicial'
  },
  {
    type: 'BACEN_JUDICIAL_TRANSFER',
    name: 'Transferência Judicial'
  },
  {
    type: 'ASAAS_DEBIT_CARD_REQUEST_FEE',
    name: 'Taxa de adesão do cartão Elo débito'
  },
  {
    type: 'ASAAS_PREPAID_CARD_REQUEST_FEE',
    name: 'Taxa de adesão do cartão Elo pré-pago'
  },
  {
    type: 'EXTERNAL_SETTLEMENT_CONTRACTUAL_EFFECT_BATCH_CREDIT',
    name: 'Crédito de valores para liquidação de efeitos de contrato'
  },
  {
    type: 'EXTERNAL_SETTLEMENT_CONTRACTUAL_EFFECT_BATCH_REVERSAL',
    name: 'Estorno de valores referentes a liquidação de efeitos de contrato'
  },
  {
    type: 'ASAAS_CARD_BILL_PAYMENT',
    name: 'Pagamento de fatura do cartão Asaas'
  },
  {
    type: 'ASAAS_CARD_BILL_PAYMENT_REFUND',
    name: 'Estorno de pagamento de fatura do cartão Asaas'
  },
  {
    type: 'CHILD_ACCOUNT_KNOWN_YOUR_CUSTOMER_BATCH_FEE',
    name: 'Taxa de criação de contas filhas'
  },
  {
    type: 'CONTRACTED_CUSTOMER_PLAN_FEE',
    name: 'Taxa da mensalidade do plano Asaas'
  }
]

export default transactionsWidgetType
