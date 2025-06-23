export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PREPARING = 'preparing',
  READY = 'ready',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

// PENDING	Aguardando pagamento ou confirmação inicial.
// PAID	Confirmado e pago, pronto para processamento.
// PREPARING	Em preparação (ex.: hambúrguer sendo feito).
// READY	Pronto para entrega ou retirada.
// SHIPPED	Em transporte (entrega a caminho).
// DELIVERED	Entregue ao cliente.
// CANCELLED	Cancelado por solicitação ou por não pagamento.
// COMPLETED	Finalizado com sucesso (opcional para representar fechamento).
