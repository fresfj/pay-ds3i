import _ from '@lodash'
import { PartialDeep } from 'type-fest'
import { EcommerceCoupon } from '../../TriggerApi'

/**
 * Pending: Aguardando para ser iniciado.
Started: Processo de envio iniciado.
In Progress: Mensagem está sendo enviada.
Sent: Mensagem enviada com sucesso.
Delivered: Mensagem entregue ao destinatário.
Read: Mensagem lida pelo destinatário.
Failed: Falha no envio da mensagem.
Retrying: Tentando reenviar a mensagem.
Cancelled: Envio da mensagem foi cancelado.
 * The coupon model.
 */
const CouponModel = (data: PartialDeep<EcommerceCoupon>) =>
  _.defaults(data || {}, {
    id: _.uniqueId('campaign-'),
    name: '',
    description: '',
    conversation: '',
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date()
  })

export default CouponModel
