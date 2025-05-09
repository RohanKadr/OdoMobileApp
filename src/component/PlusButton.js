import React, { Component } from 'react'; 
import { TouchableOpacity, View, Text, StyleSheet, Animated, Modal } from 'react-native'; 
import { Icon } from 'react-native-elements'; 
import { Colors } from '../utils/Color';
import ManualEntryForm from '../views/ManualForm';

class PlusButton extends Component {
    state = { 
        modalVisible: false,
        formModalVisible: false,
        formType: '', // 'new' or 'dummy'
        animatedValue: new Animated.Value(0),
        currentScreen: 'Receipts' // Default screen
    };

    componentDidMount() {
        // Try to get the current screen when component mounts
        this.detectCurrentScreen();
    }

    detectCurrentScreen = () => {
        const { navigation } = this.props;
        
        if (!navigation || !navigation.getState) {
            console.warn('Navigation not available in PlusButton');
            return;
        }

        try {
            const state = navigation.getState();
            const activeRoute = state.routes[state.index];
            
            // Get the nested tab navigator state if exists
            let tabState = activeRoute;
            if (activeRoute.state) {
                tabState = activeRoute.state.routes[activeRoute.state.index];
            }
            
            this.setState({ currentScreen: tabState.name });
        } catch (error) {
            console.warn('Error detecting current screen:', error);
        }
    }

    toggleModal = () => {
        this.setState({ modalVisible: !this.state.modalVisible }, this.startAnimation);
    }

    openFormModal = (type) => {
        this.detectCurrentScreen(); // Update current screen before opening
        this.setState({
            formModalVisible: true,
            formType: type,
            modalVisible: false,
        });
    }

    closeFormModal = () => {
        this.setState({ formModalVisible: false });
    }

    handleFormSubmit = (formData) => {
        const { currentScreen } = this.state;
        
        console.log('Submitting form for screen:', currentScreen);
        console.log('Form data:', formData);
        
        // Here you would call different APIs based on the current screen
        switch(currentScreen) {
            case 'Receipts':
            case 'ReceiptsTab':
                this.submitReceipt(formData);
                break;
            case 'Putaway':
            case 'PutawayTab':
                this.submitPutaway(formData);
                break;
            case 'Picking':
            case 'PickingTab':
                this.submitPicking(formData);
                break;
            case 'Deliveries':
            case 'DeliveryTab':
                this.submitDelivery(formData);
                break;
            default:
                console.warn('Unknown screen for form submission:', currentScreen);
        }
        
        this.closeFormModal();
    }

    submitReceipt = (data) => {
        console.log('Submitting to receipts API:', data);
        // Implement your actual API call here
        // Example:
        // fetch('your-receipts-api-endpoint', {
        //   method: 'POST',
        //   body: JSON.stringify(data),
        //   headers: { 'Content-Type': 'application/json' }
        // })
    }

    submitPutaway = (data) => {
        console.log('Submitting to putaway API:', data);
        // Implement your actual API call here
    }

    submitPicking = (data) => {
        console.log('Submitting to picking API:', data);
        // Implement your actual API call here
    }

    submitDelivery = (data) => {
        console.log('Submitting to deliveries API:', data);
        // Implement your actual API call here
    }

    startAnimation = () => {
        const { modalVisible, animatedValue } = this.state;
        Animated.timing(animatedValue, {
            toValue: modalVisible ? 1 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }

    render() {
        const { animatedValue, formModalVisible, formType } = this.state;

        const translateY1 = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -40],
        });

        const translateY2 = animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -80],
        });

        return (
            <View style={styles.container}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={this.toggleModal}>
                    <Icon
                        name='add'
                        type='material'
                        color={Colors.theme}
                        reverse
                        size={28}
                    />
                </TouchableOpacity>

                {this.state.modalVisible && (
                    <>
                        <Animated.View style={[styles.option, { transform: [{ translateY: translateY1 }] }]}>
                            <TouchableOpacity 
                                style={styles.optionButton}
                                onPress={() => this.openFormModal('dummy')}>
                                <Text style={styles.optionText}>Dummy</Text>
                            </TouchableOpacity>
                        </Animated.View>
                        <Animated.View style={[styles.option, { transform: [{ translateY: translateY2 }] }]}>
                            <TouchableOpacity 
                                style={styles.optionButton}
                                onPress={() => this.openFormModal('new')}>
                                <Text style={styles.optionText}>New</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </>
                )}

                <Modal
                    visible={formModalVisible}
                    animationType="slide"
                    transparent={false}
                    onRequestClose={this.closeFormModal}>
                    <ManualEntryForm 
                        onComplete={this.handleFormSubmit}
                        onCancel={this.closeFormModal}
                        initialData={formType === 'dummy' ? {
                            receiptNumber: 'VWH/IN/00001',
                            receiveFrom: 'Dummy Supplier',
                            operationType: 'Dummy Operation',
                            // Add more dummy data as needed
                        } : {}}
                    />
                </Modal>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 25,
        zIndex: 10,
    },
    button: {
        backgroundColor: Colors.white,
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    option: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: Colors.white,
        borderRadius: 20,
        marginBottom: 10,
        width: 140, 
        elevation: 2,
    },
    optionButton: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionText: {
        fontSize: 16,
        color: Colors.theme, 
    },
});

export default PlusButton;