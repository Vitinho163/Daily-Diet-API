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
        date: z.preprocess((arg) => {
          if (typeof arg === 'string') {
            // Matches DD/MM/YYYY
            if (/^\d{2}\/\d{2}\/\d{4}$/.test(arg)) {
              const [day, month, year] = arg.split('/')
              // Returns in YYYY-MM-DD format for `new Date()`
              return `${year}-${month}-${day}`
            }
          }
          return arg
        }, z.coerce.date()),
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

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const meals = await knex('meals')
        .where('user_id', request.user?.id)
        .select()

      return { meals }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const meal = await knex('meals')
        .where('id', id)
        .andWhere('user_id', request.user?.id)
        .first()

      if (!meal) {
        return { error: 'Meal not found.' }
      }

      return { meal }
    },
  )

  app.put(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      const getMealParamsSchema = z.object({
        id: z.string().uuid(),
      })

      const updateMealBodySchema = z.object({
        name: z.string().optional(),
        description: z.string().optional(),
        date: z
          .preprocess((arg) => {
            if (typeof arg === 'string') {
              if (/^\d{2}\/\d{2}\/\d{4}$/.test(arg)) {
                const [day, month, year] = arg.split('/')
                return `${year}-${month}-${day}`
              }
            }
            return arg
          }, z.coerce.date())
          .optional(),
        isOnDiet: z.boolean().optional(),
      })

      const { id } = getMealParamsSchema.parse(request.params)

      const { name, description, date, isOnDiet } = updateMealBodySchema.parse(
        request.body,
      )

      const meal = await knex('meals')
        .where('id', id)
        .andWhere('user_id', request.user?.id)
        .first()

      if (!meal) {
        return { error: 'Meal not found.' }
      }

      await knex('meals')
        .where('id', id)
        .update({
          name: name !== undefined ? name : meal.name,
          description:
            description !== undefined ? description : meal.description,
          date: date ? date.getTime() : meal.date,
          is_on_diet: isOnDiet !== undefined ? isOnDiet : meal.is_on_diet,
        })

      return reply.status(204).send()
    },
  )
}
