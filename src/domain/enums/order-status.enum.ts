export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PREPARING = 'PREPARING',
  READY = 'READY',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

// PENDING	Aguardando pagamento ou confirmação inicial.
// PAID	Confirmado e pago, pronto para processamento.
// PREPARING	Em preparação (ex.: hambúrguer sendo feito).
// READY	Pronto para entrega ou retirada.
// SHIPPED	Em transporte (entrega a caminho).
// DELIVERED	Entregue ao cliente.
// CANCELLED	Cancelado por solicitação ou por não pagamento.
// COMPLETED	Finalizado com sucesso (opcional para representar fechamento).
