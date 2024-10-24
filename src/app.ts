import fastify from 'fastify';
import { request } from 'http';

export default function createApp(options = {}) {
  const app = fastify(options)

  app.get('/api/hello', (request, reply) => {
    reply.send({ hello: "World!" })
  })

  app.get('/api/good-bye', (request, reply) => {
    reply.send({ message: 'Good Bye Visitor!' })
  })

  type BeverageRouteParams = {
    Params: { beverage: "coffee" | "tea" | "chai" },
    Querystring: { milk?: "yes" | "no", sugar?: "yes" | "no" },
    Body: { kind: string },
    Headers: { 'codecool-beverages-dietary': string }
  }

  app.post<BeverageRouteParams>('/api/beverages/:beverage', (request, reply) => {
    const { beverage } = request.params;
    const { milk, sugar } = request.query;
    const { kind } = request.body;
    const { dietaryHeader } = request.headers

    const withItem: string[] = [];
    if (milk === "yes") {
      if (dietaryHeader === 'lactose-intolerance') {
        withItem.push("lf-milk");
      } else if (dietaryHeader === 'vegan') {
        withItem.push("oat-milk");
      } else {
        withItem.push("milk");
      }
    } else {

    }
    if (sugar === "yes") {
      withItem.push("sugar")
    }
    const drinkName = kind ? `${kind} ${beverage}` : beverage
    reply.status(200).send({ drink: drinkName, with: withItem })
  })
  return app;
}
