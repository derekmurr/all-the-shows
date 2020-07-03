import React, { useState } from 'react';
import { gql } from 'apollo-boost';
// import { useMutation, useApolloClient } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { Redirect, NavLink } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './Layout';

const ADD_SHOW = gql`
  mutation AddShow(
    $performer: String!
    $openers: String
    $venue: String!
    $date: String!
  ) {
    addShow(input: {
      performer: $performer
      openers: $openers
      venue: $venue
      dateProvided: $date
      }
    ) {
      id
      performer
      openers
      venue
      date
    }
  }
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
`;

const Input = styled.input`
  display: block;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 300px;
`;

const AddShow = () => {
  const [addNewShow, { loading: mutationLoading, error: mutationError, data }] = useMutation(ADD_SHOW);
  // for reference: may have to update cache after creating new show object
  // const [addTodo] = useMutation(
  //   ADD_TODO,
  //   {
  //     update(cache, { data: { addTodo } }) {
  //       const { todos } = cache.readQuery({ query: GET_TODOS });
  //       cache.writeQuery({
  //         query: GET_TODOS,
  //         data: { todos: todos.concat([addTodo]) },
  //       });
  //     }
  //   }
  // );

  const [performer, setPerformer] = useState('');
  const [openers, setOpeners] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
  const [redirect, setRedirect] = useState(false);
  
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // const client = new useApolloClient();
    await addNewShow({ 
      variables: { performer, openers, venue, date } 
    });
    console.log(data);
    // client.writeData({ data: data });
    setPerformer('');
    setOpeners('');
    setVenue('');
    setDate('');
    setRedirect(true);
  };

  return (
    <Layout addShowPage>
      {redirect && <Redirect to="/" />}
      <form onSubmit={e => handleFormSubmit(e)}>
        <GridContainer>
          <div>
            <Label htmlFor="performer">Headline act:</Label>
            <Input 
              type="text" 
              id="performer" 
              name="performer" 
              required 
              value={performer} 
              onChange={e => setPerformer(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="openers">Opening acts:</Label>
            <Input 
              type="text" 
              id="openers" 
              name="openers" 
              value={openers} 
              onChange={e => setOpeners(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="venue">Venue:</Label>
            <Input 
              type="text" 
              id="venue" 
              name="venue" 
              required 
              value={venue} 
              onChange={e => setVenue(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="date">Date:</Label>
            <Input 
              type="date" 
              id="date" 
              name="date" 
              pattern="\d{4}-\d{2}-\d{2}" 
              required 
              value={date} 
              onChange={e => setDate(e.target.value)}/>
          </div>
        </GridContainer>
        <button type='submit'>Add Show</button>
        <NavLink to="/">Cancel</NavLink>
        {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error! Please try again.</p>}
      </form>
    </Layout>
  );
}

export default AddShow;