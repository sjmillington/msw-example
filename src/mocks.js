import { setupWorker, rest } from 'msw'

export const worker = setupWorker(
    rest.get('/greeting', (req, res, ctx) => {
        return res(
            ctx.status(200),
            ctx.delay(1000),
            ctx.json({ greeting: 'hello you' })
        )
    })
)
  
worker.start();