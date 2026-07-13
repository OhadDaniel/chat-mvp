import { useNewGroupContext } from '../NewGroup.context'
import { NewGroupPerson } from './NewGroupPerson'
import {
  NEW_GROUP_EMPTY_LABEL,
  NEW_GROUP_LIST_CLASS,
  NEW_GROUP_EMPTY_CLASS,
} from '../NewGroup.constants'

export function NewGroupPeople() {
  const { users } = useNewGroupContext()

  return users.length === 0 ? (
    <p className={NEW_GROUP_EMPTY_CLASS}>{NEW_GROUP_EMPTY_LABEL}</p>
  ) : (
    <div className={NEW_GROUP_LIST_CLASS}>
      {users.map(user => (
        <NewGroupPerson key={user.id} user={user} />
      ))}
    </div>
  )
}
