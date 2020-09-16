import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

// adapter
// nossa controler espera uma HttpRequest e responde uma HttpResponse
// já o express envia um Request e espera um Request
export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
