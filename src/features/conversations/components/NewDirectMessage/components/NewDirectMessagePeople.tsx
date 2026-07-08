import { useNewDirectMessageContext } from '../NewDirectMessage.context'
import { NewDirectMessagePerson } from './NewDirectMessagePerson'
import {
  NEW_DM_EMPTY_LABEL,
  NEW_DM_LIST_CLASS,
  NEW_DM_EMPTY_CLASS,
} from '../NewDirectMessage.constants'

export function NewDirectMessagePeople() {
  const { users } = useNewDirectMessageContext()

  return users.length === 0 ? (
    <p className={NEW_DM_EMPTY_CLASS}>{NEW_DM_EMPTY_LABEL}</p>
  ) : (
    <div className={NEW_DM_LIST_CLASS}>
      {users.map(user => (
        <NewDirectMessagePerson key={user.id} user={user} />
      ))}
    </div>
  )
}
