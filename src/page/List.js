import React from 'react';
import Card from "./Card";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";

export default function DrawerList(props) {
    const {cards} = props;
    console.log(cards);
    return <List>
        {cards ? cards.map(e => {
            return <Card key={e["img"][0]} title={e["title"]} summary={e["summary"]} text={e["text"]} img={e["img"][0]} address={e["address"]}
                         category={e["category"]} date={e["date"]} lat={parseFloat(e.lat)} lng={parseFloat(e.lng)}/>
        }) : <Container>
            <Typography>
                아직 등록된 이미지가 없습니다.
                위치를 찍어주세요.
            </Typography>
        </Container>}
    </List>
}