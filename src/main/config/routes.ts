import { Express, Router } from 'express'
import fg from 'fast-glob'// tipo um fs da vida

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  // retorna nome dos arquivos dentro de /routes
  fg.sync('**/src/main/routes/**routes.ts').map(async file => {
    // file = src/main/routes/signup-routes.ts
    // pegar a função default, e passo router pra ela
    (await import(`../../../${file}`)).default(router)
  })
}
