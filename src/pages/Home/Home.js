import { React, useEffect, useState } from "react";
import Text from "components/Text";
import UserList from "components/UserList";
import { usePeopleFetch } from "hooks";
import * as S from "./style";

const Home = ({tabIndex}) => {
  const [goFetch, setGoFetch] = useState(true);
  const { users, isLoading } = usePeopleFetch({goFetch});
  const [tab, setTab] = useState('home');
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const tabName = !tabIndex ? 'home' : 'favorites';
    setTab(tabName);
  }, [tabIndex]);

  useEffect(() => {
    if (!isLoading && tab === 'home') {
      setGoFetch(false);
      setAllUsers(allUsers.concat(users));
    }
  }, [users]);

  const loadMore = () => {
    setGoFetch(true);
  }

  return (
    <S.Home>
      <S.Content>
        <S.Header>
          <Text size="64px" bold>
            PplFinder
          </Text>
        </S.Header>
        <UserList users={allUsers} isLoading={isLoading} tab={tab} loadMore={loadMore}/>
      </S.Content>
    </S.Home>
  );
};

export default Home;
