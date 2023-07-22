import { useState } from 'react';
import { FlatList, StyleSheet, Text, View, Button, Modal } from 'react-native';
import RenderCampsite from '../features/campsites/RenderCampsite';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite } from '../features/favorites/favoritesSlice';
import { Input, Rating } from 'react-native-elements';
import { postComment } from '../features/comments/commentsSlice';




const CampsiteInfoScreen = ({ route }) => {
    const { campsite } = route.params;

    const comments = useSelector((state) => state.comments);
    const favorites = useSelector((state) => state.favorites);
    const dispatch = useDispatch();

    const [showModal, setShowModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [author, setAuthor] = useState('');
    const [text, setText] = useState('');

 

    const handleSubmit = () => {
        const newComment = {
            author,
            rating,
            text,
            campsiteId: campsite.id
        };
        dispatch(postComment(newComment));
        setShowModal(!showModal);
        resetForm();
    }

    const resetForm = () => {
        setRating(5)
        setAuthor('')
        setText('')
    }

    const renderCommentItem = ({ item }) => {
        return (
            <View style={styles.commentItem}>
                <Text style={{ fontSize: 14 }}>{item.text}</Text>
                {/* <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text> */}
                <Rating 
                    readonly
                    startingValue={item.rating}
                    imageSize={10}
                    style={{
                        alignItems:'flex-start',
                        paddingVertical: '5%'
                    }}
                />
                <Text style={{ fontSize: 12 }}>
                    {`-- ${item.author}, ${item.date}`}
                </Text>
            </View>
        );
    };

    return (
        <>
            <FlatList
                data={comments.commentsArray.filter(
                    (comment) => comment.campsiteId === campsite.id
                )}
                renderItem={renderCommentItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ marginHorizontal: 20, paddingVertical: 20 }}
                ListHeaderComponent={
                    <>
                        <RenderCampsite 
                            campsite={campsite} 
                            isFavorite={favorites.includes(campsite.id)}
                            markFavorite={() => 
                                dispatch(toggleFavorite(campsite.id))
                            }
                            onShowModal={() => setShowModal(!showModal)}
                        />
                        <Text style={styles.commentsTitle}>Comments</Text>
                    </>
                }
            />
            <Modal
            animationType='slide'
            transparent={false}
            visible={showModal}
            onRequestClose={() => setShowModal(!showModal)}
        >
            <View style={styles.modal}>
                <Rating
                    showRating
                    startingValue={rating}
                    imageSize={40}
                    onFinishRating={(rating)=> setRating(rating)}
                    style={{paddingVertical: 10}}
                ></Rating>
                <Input
                    placeholder='Author'
                    leftIcon='user-o'
                    leftIconContainerStyle={{ paddingRight : 10 }}
                    onChangeText={(author)=> setAuthor(author)}
                    value={author}
                ></Input>
                <Input
                    placeholder='Comment'
                    leftIcon='comment-o'
                    leftIconContainerStyle={{ paddingRight : 10 }}
                    onChangeText={(text)=> setText(text)}
                    value={text}
                ></Input>
                <View style={{margin: 10}}>
                    <Button
                        onPress={() => {
                            handleSubmit();
                            resetForm();
                        }}
                        color='#5637DD'
                        title='Submit'
                    >

                    </Button>
                </View>
                <View style={{margin: 10}}>
                    <Button
                        onPress={() => {
                            setShowModal(!showModal);
                            resetForm();
                        }}
                        color='#808080'
                        title='Cancel'
                    />
                </View>
            </View>
        </Modal>
    </>
    );
};

const styles = StyleSheet.create({
    commentsTitle: {
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#43484D',
        padding: 10,
        paddingTop: 30
    },
    commentItem: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    modal: {
        justifyContent: 'center',
        margin: 20,
    },

});

export default CampsiteInfoScreen;