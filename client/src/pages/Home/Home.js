import React from 'react'
import { gql, useQuery} from '@apollo/client';
import { Row, Col, Button , Image} from 'react-bootstrap';

const GET_USERS = gql`
    query {
        getUsers {
            username
            imageUrl
            createdAt
            latestMessage{
              content
              from 
              to
            }
        }
    }
`

function Home() {

  const { loading, error, data } = useQuery(GET_USERS);

  let userMarkUp 

  if(!data || loading){

    userMarkUp = <p>Loading...</p>

  }
   else if(data.getUsers.length === 0)
   {
    userMarkUp = <p>No users have joined Yet</p>
  }
  else if(data.getUsers.length > 0){
    userMarkUp = data.getUsers.map( (user) => {
      <p>user.username</p>
    //   <div
    //   className="d-flex p-3"
    //   key={user.username}
    //   // onClick={() => setSelectedUser(user.username)}
    // >
    //   <Image
    //     src={user.imageUrl}
    //     roundedCircle
    //     className="mr-2"
    //     style={{ width: 50, height: 50, objectFit: 'cover' }}
    //   />
    //   <div>
    //     <p className="text-success">{user.username}</p>
    //     <p className="font-weight-light">
    //       {user.latestMessage
    //         ? user.latestMessage.content
    //         : 'You are now connected!'}
    //     </p>
    //   </div>
    // </div>
    }
        // <div className='d-flex p-3' key = { user.username }>
        //     <Image src ="https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Favatar&psig=AOvVaw39h9MBLrhuoDAAQg1pz8BR&ust=1709641227535000&source=images&cd=vfe&opi=89978449&ved=0CBMQjRxqFwoTCNiCi4LM2oQDFQAAAAAdAAAAABAE" roundedCircle className='mr-2'
        //       style={{width:50,height: 50, objectFit: 'cover'}}
        //     />

        //     <div >
        //       <p className='text-success'>{user.username == user.latestMessage.from ? user.latestMessage.from : user.latestMessage.to}</p>
        //       <p className="font-weight-light">
        //       {user.latestMessage
        //       ? user.latestMessage.content
        //       : "You are now connected"
        //       }
        //       </p>
        //   </div>

        // </div>
    )
  }

  console.log(data);

  console.log(error);

  return (
    <div>{userMarkUp}</div>
    
  )
}

export default Home