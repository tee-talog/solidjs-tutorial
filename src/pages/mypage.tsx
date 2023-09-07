import {
  createEffect,
  createSignal,
  For,
  Show,
  type JSX,
  createResource,
  Suspense,
  ErrorBoundary
} from 'solid-js'

type User = { name: string; id: string }

const [data, { refetch }] = createResource(async () => {
  // 参考: https://qiita.com/danishi/items/42d8adf6291515e62284
  const res = await fetch('https://api.adviceslip.com/advice')
  return res.json()
})

const MyPage = () => {
  const [name, setName] = createSignal('')
  const [list, setList] = createSignal<User[]>([])

  const onInput: JSX.EventHandler<HTMLInputElement, InputEvent> = (ev) => {
    setName(ev.currentTarget.value)
  }

  const onSubmit: JSX.EventHandler<HTMLFormElement, SubmitEvent> = (ev) => {
    ev.preventDefault()
    setList([...list(), { name: name(), id: crypto.randomUUID() }])
    setName('')
  }

  const reload = () => {
    refetch()
  }

  createEffect(() => {
    console.log(name())
  })

  return (
    <section class="p-4">
      <section>
        <ErrorBoundary fallback={<>error!</>}>
          <Suspense fallback={<>loading...</>}>
            Advice: <span class="italic">{data()?.slip.advice}</span>
          </Suspense>
        </ErrorBoundary>
        <div>
          <button type="button" class="border-2 border-slate-600 px-1" onClick={reload}>reload</button>
        </div>
      </section>

      <hr class="my-4" />

      <section>
        <form onSubmit={onSubmit}>
          <label>
            <span class="mr-2">Name</span>
            <input
              type="text"
              name="name"
              class="p-1 mr-2 border-2 border-slate-600"
              onInput={onInput}
              value={name()}
            />
          </label>
          <span>{name()}</span>

          <div class="mt-4">
            <button type="submit" class="border-2 border-slate-600 px-2 py-1">
              submit
            </button>
          </div>
        </form>
      </section>

      <hr class="my-4" />

      <section>
        <Show when={list().length === 0}>(No User)</Show>
        <ul>
          <For each={list()}>
            {(item) => (
              <li>
                {item.id}: {item.name}
              </li>
            )}
          </For>
        </ul>
      </section>
    </section>
  )
}

export default MyPage
