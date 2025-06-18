export function formatCurrencyInCents(currencyInCents: number) {
  const currency = currencyInCents / 100

  return currency.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}
