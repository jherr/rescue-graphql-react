import React, { useState } from "react";
import { useQuery, gql } from "@apollo/client";
import {
  GridList,
  GridListTile,
  CssBaseline,
  Container,
  IconButton,
  GridListTileBar,
  Grid,
  Typography,
  makeStyles,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";

const useStyles = makeStyles({
  media: {
    height: 360,
  },
  gridCell: {
    overflow: "hidden",
  },
  gridListContainer: {
    height: 1000,
  },
});

const DOGS_SEARCH = gql`
  query {
    search(location: 97086, limit: 50) {
      animalID
      animalName
      animalBreed
      animalDescription
      animalDescriptionPlain
      animalAvailableDate
      animalPictures {
        large {
          url
        }
      }
      animalOrg {
        orgName
        orgWebsiteUrl
        orgPhone
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(DOGS_SEARCH);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const classes = useStyles();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Container>
      <CssBaseline />
      <Grid container spacing={1}>
        <Grid item md={8} className={classes.gridCell}>
          <GridList cols={4} className={classes.gridListContainer}>
            {data.search
              .filter(({ animalPictures }) => animalPictures.length > 0)
              .map((animal) => (
                <GridListTile key={animal.animalPictures[0].large.url}>
                  <img
                    alt={animal.animalName}
                    src={animal.animalPictures[0].large.url}
                  />
                  <GridListTileBar
                    title={`${animal.animalName}: ${animal.animalAvailableDate}`}
                    actionIcon={
                      <IconButton
                        onClick={() => setSelectedAnimal(animal)}
                        aria-label={`info about ${animal.animalName}`}
                      >
                        <InfoIcon />
                      </IconButton>
                    }
                  />
                </GridListTile>
              ))}
          </GridList>
        </Grid>
        <Grid item md={4}>
          {selectedAnimal && (
            <Card>
              <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={selectedAnimal.animalPictures[0].large.url}
                  title={selectedAnimal.animalName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {selectedAnimal.animalName}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="h2">
                    {selectedAnimal.animalBreed}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
                    dangerouslySetInnerHTML={{
                      __html: selectedAnimal.animalDescription,
                    }}
                  />
                  <Typography variant="body2" component="p">
                    <a href={selectedAnimal.animalOrg.orgWebsiteUrl}>
                      {selectedAnimal.animalOrg.orgName}
                    </a>
                  </Typography>
                  <Typography variant="body2" component="p">
                    {selectedAnimal.animalOrg.orgPhone}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
