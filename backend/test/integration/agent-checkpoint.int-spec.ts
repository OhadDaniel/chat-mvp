import { MongoClient } from 'mongodb';
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb';
import { Annotation, END, START, StateGraph } from '@langchain/langgraph';

const CounterState = Annotation.Root({
  count: Annotation<number>({
    reducer: (current, update) => current + update,
    default: () => 0,
  }),
});

function buildCounterGraph(saver: MongoDBSaver) {
  return new StateGraph(CounterState)
    .addNode('increment', () => ({ count: 1 }))
    .addEdge(START, 'increment')
    .addEdge('increment', END)
    .compile({ checkpointer: saver });
}

async function connect(): Promise<MongoClient> {
  const client = new MongoClient(process.env.MONGO_URI as string);
  await client.connect();
  return client;
}

describe('Agent checkpointer (integration)', () => {
  const config = { configurable: { thread_id: 'resume-thread' } };

  it('resumes accumulated state on the same thread after a fresh saver instance', async () => {
    const clientA = await connect();
    const saverA = new MongoDBSaver({ client: clientA });
    await saverA.setup();

    const first = await buildCounterGraph(saverA).invoke({ count: 0 }, config);
    expect(first.count).toBe(1);
    await clientA.close();

    const clientB = await connect();
    const saverB = new MongoDBSaver({ client: clientB });

    const resumed = await buildCounterGraph(saverB).invoke({ count: 0 }, config);
    expect(resumed.count).toBe(2);

    const fresh = await buildCounterGraph(saverB).invoke(
      { count: 0 },
      { configurable: { thread_id: 'other-thread' } },
    );
    expect(fresh.count).toBe(1);

    const snapshot = await buildCounterGraph(saverB).getState(config);
    expect((snapshot.values as { count: number }).count).toBe(2);
    await clientB.close();
  });
});
