export const portalUrls = {
  morador: 'http://localhost:3000/login',
  sindico: 'http://localhost:3002/login',
  funcionario: 'http://localhost:3001/login',
} as const

export type PortalType = keyof typeof portalUrls

export const redirectToPortal = (type: PortalType) => {
  window.location.href = portalUrls[type]
}
