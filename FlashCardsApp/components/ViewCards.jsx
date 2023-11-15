import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity, Button
} from "react-native";
import { getCards, deleteCard } from "../api";
import { UserContext } from "../contexts/Theme";

export const ViewCards = ({  route, navigation }) => {
  console.log("Route Params:", route.params);
  const { user } = useContext(UserContext);
  const { topic } = route.params || {};
  console.log(user)

  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingCard, setDeletingCard] = useState(null)

  const handleSubmit = (card_id) => {
    alert('Card deleted')
      setIsDeleting(true);
      setCards((currCards) => {
        return currCards.filter((card) => card._id !== card_id) 
    });
      deleteCard(card_id)
      .then(() => {
        setIsDeleting(false)
        setDeletingCard(null)
      })
      .catch((error) => {
        setCards((currCards) => [...currCards])
        setIsDeleting(false)
        setDeletingCard(null)
      })
    }

  useEffect(() => {
    setIsLoading(true);
    getCards(topic)
      .then((cards) => {
        setIsLoading(false);
        setCards(cards);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, [topic]);

  if (isLoading) {
    return (
      <View>
        <Text style={styles.pageUpdates}>loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.pageUpdates}>No Results Found</Text>
      </View>
    );
  }

  if (cards.length === 0) {
    return (
      <View>
        <Text style={styles.pageUpdates}>No Cards Found on this Topic</Text>
      </View>
    );
  }
  console.log('Rendered Cards:', cards[0].author); // Log the cards being rendered#

  return (
    <View style={styles.cardsAllContainer}>
      <ScrollView>
        {cards
          .filter((card) => card.author === user.username)
          .map((card) => (
        
            <View style={styles.cardListItem} key={card._id}> 
            <TouchableOpacity key={card._id} onPress={()=>{navigation.navigate('Card', {card_id: card._id})}}>
          <Text>{card.question}</Text>
          </TouchableOpacity>
         <View style={styles.deleteButton}>
         <Button title="Delete"  color= "red"  onPress={()=>{handleSubmit(card._id)}}  />
         </View>
{/* style to distinguish for correct or incorrect answer*/}
          {card.isCorrect !== undefined && (
          <Text style={{ color: card.isCorrect ? 'green' : 'red' }}>
            {card.isCorrect ? 'Correct' : 'Incorrect'}
          </Text>
        )}

        </View>   
     ))}
    </ScrollView>
    </View>
  );
    }


const styles = StyleSheet.create({
  cardsAllContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
  },
  cardListItem: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "lightgray",
    backgroundColor: "white",
    padding: 16,
    margin: 8,
    width: 400,
    height: 150,
  },
  deleteButton: {
    borderRadius: 100,
    position: "absolute", 
    bottom: "16px",
    flex: 1,
    right: 10
  },
  pageUpdates: {
    backgroundColor: "skyblue",
    marginTop: "50px",
    textAlign: "center",
    padding: "16px",
    fontSize: "32px",
  },
});
