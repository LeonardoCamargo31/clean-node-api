import { HttpRequest, HttpResponse } from './http'

// todas nossas controllers deve implementar essa interface
export interface Controller{
  handle (httpRequest: HttpRequest): Promise<HttpResponse>
}
