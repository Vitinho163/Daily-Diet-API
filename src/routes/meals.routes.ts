import { FastifyInstance } from 'fastify'
import z from 'zod'
import { randomUUID } from 'node:crypto'
import { knex } from '../database'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function mealsRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const createMealBodySchema = z.object({
        name: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        isOnDiet: z.boolean(),
      })

      const { name, description, date, isOnDiet } = createMealBodySchema.parse(
        request.body,
      )

      await knex('meals').insert({
        id: randomUUID(),
        name,
        description,
        date: date.getTime(),
        is_on_diet: isOnDiet,
        user_id: request.user?.id,
      })

      return reply.status(201).send()
    },
  )
}
