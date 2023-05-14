import {View, FlatList, SafeAreaView, TouchableOpacity, Text, ScrollView, Alert} from "react-native";
import React, {useEffect, useRef, useState} from "react";
import Goal from "../components/Goal";
import {
    useTheme,
    Button,
    FAB,
    Card,
    HelperText, ActivityIndicator
} from "react-native-paper";
import {validateGoalDescription, validateGoalObjective, validateGoalTitle} from "../utils/validations";
import Input from "../components/Input";
import {greyColor, secondaryColor, tertiaryColor} from "../consts/colors";
import {Picker} from "@react-native-picker/picker";
import {DateTimePickerAndroid} from "@react-native-community/datetimepicker";
import {fiufitStyles} from "../consts/fiufitStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import goalsService from "../services/goalsService";
import FiufitDialog from "../components/FiufitDialog";

const GoalsScreen = () => {
    const theme = useTheme();
    const rolePickerRef = useRef();

    const [goals, setGoals] = useState([]);
    const [completedGoals, setCompletedGoals] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [newGoalFormVisible, setNewGoalFormVisible] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [metricsData, setMetricsData] = useState([]);
    const [loading, setLoading] = useState(false);

    // New goal form fields
    const [goalTitle, setGoalTitle] = useState('');
    const [goalDescription, setGoalDescription] = useState('');
    const [goalMetric, setGoalMetric] = useState('');
    const [goalUnit, setGoalUnit] = useState('');
    const [goalObjective, setGoalObjective] = useState('');
    const [currentProgress, setCurrentProgress] = useState('');
    const [goalTimeLimit, setGoalTimeLimit] = useState('');

    // Dialog
    const [visible, setVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const [dialogIsOk, setDialogIsOk] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    // Hook to fetch user goals and set goal metrics options
    useEffect(() => {
        setLoading(true);
        getMetrics()
            .catch(error => {
                setLoading(false);
                console.log(error);
                setDialog(false);
            });
        getGoals()
            .catch(error => {
                setLoading(false);
                console.log(error);
                setDialog(false);
            });
    }, []);

    // Hook to change automatically the goal unit when the goal metric changes
    useEffect(() => {
        if (!metricsData) return;
        const selectedMetric = metricsData.find(metric => metric.name === goalMetric);
        if (selectedMetric) {
            setGoalUnit(selectedMetric.unit);
        } else {
            const selectedOption = metricsData.find(option => option.name === goalMetric);
            if (selectedOption) {
                setGoalUnit(selectedOption.unit);
            }
        }
    }, [goalMetric]);

    const getGoals = async () => {
        try {
            setLoading(true);
            const response = await goalsService.get();
            if (response) {
                setGoals([]);
                setCompletedGoals([]);
                response.forEach(goal => {
                    if (goal.objective <= goal.progress) {
                        setCompletedGoals(prevState => [...prevState, goal]);
                    } else {
                        setGoals(prevState => [...prevState, goal]);
                    }
                });
                setLoading(false)
            }
        } catch (error) {
            throw new Error(error);
        }
    };

    const getMetrics = async () => {
        const response = await goalsService.getMetrics();
        if (response) {
            setMetricsData(response);
            setGoalMetric(response[0].name);
        }
    };

    // Delete selected goals when user confirms
    const handleConfirm = () => {
        setLoading(true);
        hideDialog();
        deleteSelectedGoals()
            .catch(error => {
                setLoading(false);
                console.log(error);
                setDialog(false);
            });
    };

    const handleDelete = () => {
        setDialogTitle('Delete goals');
        setDialogContent('Are you sure you want to delete the selected goals?');
        setDialogIsOk(false);
        showDialog();
    }

    const deleteSelectedGoals = async () => {
        try {
            const promises = selectedIds.map(id => goalsService.delete(id));
            await Promise.all(promises);
        } catch (error) {
            console.log(error);
            setDialog(false);
        }

        getGoals()
            .catch(error => {
                console.log(error);
                setDialog(false);
            });
        setSelectedIds([]);
    }

    const handleSelectedChange = (id, selected) => {
        if (selected) {
            setSelectedIds(prevSelectedIds => [...prevSelectedIds, id]);
        } else {
            setSelectedIds(prevSelectedIds => prevSelectedIds.filter(selectedId => selectedId !== id));
        }
    };

    // Calendar to select the time limit of the goal
    const showDatepicker = () => {
        showMode('date');
    };

    const showMode = (currentMode) => {
        const minDate = new Date();
        const maxDate = new Date();
        maxDate.setDate(new Date().getDate() + 7);
        DateTimePickerAndroid.open({
            value: goalTimeLimit || new Date(),
            onChange,
            mode: currentMode,
            is24Hour: true,
            minimumDate: minDate,
            maximumDate: maxDate,
        });
    };

    const onChange = (event, selectedDate) => {
        setGoalTimeLimit(selectedDate.toISOString().split('T')[0]);
    };

    // Activates edit mode and retrieves the data of the selected goal
    const handleEdit = () => {
        const cardIndex = goals.findIndex(card => card.id === selectedIds[0]);
        if (cardIndex !== -1) {
            const card = goals[cardIndex];
            setGoalTitle(card.title);
            setGoalDescription(card.description);
            setGoalMetric(card.activity);
            setGoalObjective(card.objective.toString());
            setGoalTimeLimit(card.timeLimit);
            setEditMode(true);
        }
    }

    // Saves the changes made to the selected goal
    const editSelectedGoal = () => {
        if (!validateGoalForm()) {
            setDialog(true);
            return;
        }
        setLoading(true);
        const cardIndex = goals.findIndex(card => card.id === selectedIds[0]);
        const card = goals[cardIndex];
        if (cardIndex !== -1) {
            card.title = goalTitle;
            card.description = goalDescription;
            card.objective = goalObjective;
            goalTimeLimit ? (card.time_limit = goalTimeLimit) : (card.time_limit = '');
            currentProgress.length > 0 ? (card.progress = currentProgress) : (card.progress = 0);
            setGoals(prevCardData => [...prevCardData]);
            setEditMode(false);
        }
        goalsService.update(card)
            .catch(error => {
                console.log(error);
                setDialog(false);
            })
            .finally(() => {
                getGoals()
                    .catch(error => {
                        console.log(error);
                        setDialog(false);
                    });
                resetNewGoalForm();
            });
    }

    const validateGoalForm = () => {
        let valid = true;

        if (!validateGoalTitle(goalTitle, false)) valid = false;
        if (!validateGoalDescription(goalDescription, false)) valid = false;
        if (!validateGoalObjective(goalObjective, false)) valid = false;

        return valid;
    }

    const createGoal = () => {
        if (!validateGoalForm()) {
            setDialog(true);
            return;
        }
        setLoading(true);
        const newGoal = {
            title: goalTitle,
            description: goalDescription,
            metric: goalMetric,
            objective: goalObjective,
            time_limit: goalTimeLimit,
        }
        resetNewGoalForm();
        goalsService.create(newGoal)
            .catch(error => {
                console.log(error);
                setDialog(false);
            })
            .finally(() => {
                getGoals()
                    .catch(error => {
                        console.log(error);
                        setDialog(false);
                    });
            });
    }

    const resetNewGoalForm = () => {
        setNewGoalFormVisible(false)
        setGoalTitle('');
        setGoalDescription('');
        setGoalObjective('');
        setGoalTimeLimit('');
        if (metricsData.length > 0) {
            setGoalMetric(metricsData[0].name);
        }
        setSelectedIds([]);
    }

    const setDialog = (isUserError) => {
        setDialogIsOk(true);
        if (isUserError) {
            setDialogTitle("Error");
            setDialogContent("Invalid form. Please fill all the non optional fields and try again.");
        } else {
            setDialogTitle("Network error");
            setDialogContent("An error has occurred while trying to connect to the server. Please try again later.");
        }
        showDialog();
    }

    const renderGoals = ({item}) => {
        return (
            <Goal
                title={item.title}
                description={item.description}
                activity={item.metric}
                unit={item.unit}
                objective={item.objective}
                progress={item.progress}
                timeLimit={item.time_limit}
                onSelectedChange={(selected) => handleSelectedChange(item.id, selected)}
                changedSelection={selectedIds.length > 0}
            />
        );
    }

    return (
        <SafeAreaView style={{
            backgroundColor: theme.colors.background,
            flex: 1
        }}>
            <Text style={{
                ...fiufitStyles.titleText,
                alignSelf: 'center',
                marginTop: 10,
            }}>
                Goals
            </Text>
            {loading ? (
                    <ActivityIndicator size="large" color={theme.colors.secondary} style={{flex: 1}}/>
                )
                :
                (
                    <View style={{flex: 1}}>
                        {!newGoalFormVisible && !editMode && (
                            <View>
                                {goals && goals.length === 0 && completedGoals.length === 0 && (
                                    <Text style={{
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        color: theme.colors.tertiary,
                                        fontSize: 20,
                                    }}>
                                        You have no goals yet, add one!
                                    </Text>
                                )}
                                {completedGoals && completedGoals.length > 0 && (
                                    <Text style={{
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        color: theme.colors.tertiary,
                                    }}>
                                        Completed goals
                                    </Text>
                                )}
                                <FlatList data={completedGoals} renderItem={renderGoals} keyExtractor={item => item.id}/>
                                {goals && goals.length > 0 && (
                                    <Text style={{
                                        alignSelf: 'center',
                                        marginTop: 10,
                                        color: theme.colors.tertiary,
                                    }}>
                                        Active goals
                                    </Text>
                                )}
                                <FlatList data={goals} renderItem={renderGoals} keyExtractor={item => item.id}/>
                            </View>
                        )}
                        <FAB
                            icon={'delete'}
                            onPress={handleDelete}
                            style={{
                                position: 'absolute',
                                margin: 16,
                                right: 0,
                                bottom: 0,
                                borderRadius: 30,
                                backgroundColor: theme.colors.primary,
                            }}
                            mode={'flat'}
                            color={theme.colors.secondary}
                            visible={selectedIds.length > 0}
                        />
                        <FiufitDialog
                            visible={visible}
                            onDismiss={hideDialog}
                            title={dialogTitle}
                            content={dialogContent}
                            handleConfirm={handleConfirm}
                            handleCancel={hideDialog}
                            handleOk={hideDialog}
                            isOk={dialogIsOk}
                        />
                        <FAB
                            icon={'pencil'}
                            onPress={handleEdit}
                            style={{
                                position: 'absolute',
                                margin: 16,
                                marginBottom: 90,
                                right: 0,
                                bottom: 0,
                                borderRadius: 30,
                            }}
                            mode={'flat'}
                            visible={selectedIds.length === 1 && !newGoalFormVisible}
                        />
                        <FAB
                            icon={'plus'}
                            onPress={() => setNewGoalFormVisible(true)}
                            style={{
                                position: 'absolute',
                                margin: 16,
                                right: 0,
                                bottom: 0,
                                borderRadius: 30,
                                backgroundColor: theme.colors.primary,
                            }}
                            mode={'flat'}
                            visible={selectedIds.length === 0 && !newGoalFormVisible}
                            color={theme.colors.secondary}
                        />
                        {editMode && (
                            <View style={{
                                justifyContent: 'center',
                                position: 'absolute',
                                width: '100%',
                            }}>
                                <Card style={{
                                    margin: 10,
                                    borderRadius: 5,
                                    elevation: 5,
                                    backgroundColor: theme.colors.background,
                                    justifyContent: 'center',
                                    borderWidth: 1,
                                    borderColor: theme.colors.secondary,
                                }}>
                                    <Card.Content>
                                        <Input label="Title"
                                               placeholder="Enter title"
                                               value={goalTitle}
                                               onChangeText={text => setGoalTitle(text)}
                                        />
                                        <HelperText type="error" visible={!validateGoalTitle(goalTitle, true)}
                                                    style={{
                                                        marginTop: -20,
                                                        marginBottom: validateGoalTitle(goalTitle, true) ? -20 : 0,
                                                    }}>
                                            Title should be between 1 and 15 characters long
                                        </HelperText>
                                        <Input label="Description"
                                               placeholder="Enter description"
                                               value={goalDescription}
                                               onChangeText={text => setGoalDescription(text)}
                                        />
                                        <HelperText type="error"
                                                    visible={!validateGoalDescription(goalDescription, true)}
                                                    style={{
                                                        marginTop: -20,
                                                        marginBottom: !validateGoalDescription(goalDescription, true) ? -20 : 0,
                                                    }}>
                                            Description should be between 1 and 30 characters long
                                        </HelperText>
                                        <Input label={`Current ${goalUnit ? `(${goalUnit})` : ''}`}
                                               placeholder="Enter your progress"
                                               keyboardType={'numeric'}
                                               value={currentProgress}
                                               onChangeText={text => setCurrentProgress(text)}
                                        />
                                        <Input label={`Objective ${goalUnit ? `(${goalUnit})` : ''}`}
                                               placeholder="Enter objective"
                                               keyboardType={'numeric'}
                                               value={goalObjective}
                                               onChangeText={text => setGoalObjective(text)}
                                        />
                                        <HelperText type="error" visible={!validateGoalObjective(goalObjective, true)}
                                                    style={{
                                                        marginTop: -20,
                                                        marginBottom: !validateGoalObjective(goalObjective, true) ? -20 : 0,
                                                    }}>
                                            Objective should be a natural number
                                        </HelperText>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-around',
                                            marginTop: 15,
                                        }}>
                                            <Button onPress={() => {
                                                setEditMode(false);
                                                resetNewGoalForm();
                                            }}
                                                    textColor={theme.colors.background}
                                                    style={{
                                                        backgroundColor: theme.colors.primary,
                                                        width: 100,
                                                        alignSelf: 'center',
                                                    }}>Cancel</Button>
                                            <Button onPress={editSelectedGoal}
                                                    textColor={theme.colors.secondary}
                                                    style={{
                                                        backgroundColor: theme.colors.background,
                                                        borderWidth: 1,
                                                        borderColor: theme.colors.secondary,
                                                        width: 100,
                                                        alignSelf: 'center',
                                                    }}>Save</Button>
                                        </View>
                                    </Card.Content>
                                </Card>
                            </View>
                        )}
                        {newGoalFormVisible && (
                            <ScrollView keyboardShouldPersistTaps={'handled'} contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'center',
                            }}>
                                <View style={{
                                    justifyContent: 'center',
                                    position: 'relative',
                                    width: '100%',
                                }}>
                                    <Card style={{
                                        margin: 10,
                                        borderRadius: 5,
                                        elevation: 5,
                                        backgroundColor: theme.colors.background,
                                        justifyContent: 'center',
                                        borderWidth: 1,
                                        borderColor: theme.colors.secondary,
                                    }}>
                                        <Card.Content>
                                            <Input label="Title"
                                                   placeholder="Enter title"
                                                   value={goalTitle}
                                                   onChangeText={text => setGoalTitle(text)}
                                            />
                                            <HelperText type="error"
                                                        visible={!validateGoalTitle(goalTitle, true)}
                                                        style={{
                                                            marginTop: -20,
                                                            marginBottom: validateGoalTitle(goalTitle, true) ? -20 : 0,
                                                        }}>
                                                Title should be between 1 and 15 characters long
                                            </HelperText>
                                            <Input label="Description"
                                                   placeholder="Enter description"
                                                   value={goalDescription}
                                                   onChangeText={text => setGoalDescription(text)}
                                            />
                                            <HelperText type="error"
                                                        visible={!validateGoalDescription(goalDescription, true)}
                                                        style={{
                                                            marginTop: -20
                                                        }}>
                                                Description should be between 1 and 30 characters long
                                            </HelperText>
                                            <Text style={{
                                                color: theme.colors.tertiary,
                                                marginBottom: 5,
                                                marginTop: validateGoalDescription(goalDescription, true) ? -35 : 5,
                                            }}>Activity</Text>
                                            <View style={{
                                                borderRadius: 10,
                                                overflow: 'hidden',
                                                height: 55,
                                                marginBottom: 10,
                                            }}>
                                                <Picker
                                                    ref={rolePickerRef}
                                                    onValueChange={(itemValue) => setGoalMetric(itemValue)}
                                                    selectedValue={goalMetric}
                                                    dropdownIconColor={tertiaryColor}
                                                    style={{
                                                        backgroundColor: secondaryColor,
                                                        color: tertiaryColor,
                                                        marginBottom: 10,
                                                        height: 55,
                                                    }}
                                                    mode={'dropdown'}
                                                    prompt={'Select an activity'}
                                                >
                                                    {metricsData.map((option, index) => (
                                                        <Picker.Item style={{
                                                            backgroundColor: secondaryColor,
                                                            color: tertiaryColor
                                                        }} label={option.name} value={option.name} key={index}/>
                                                    ))}
                                                </Picker>
                                            </View>
                                            <Input label={`Objective ${goalUnit ? `(${goalUnit})` : ''}`}
                                                   placeholder="Enter objective"
                                                   keyboardType={'numeric'}
                                                   value={goalObjective}
                                                   onChangeText={text => setGoalObjective(text)}
                                            />
                                            <HelperText type="error"
                                                        visible={!validateGoalObjective(goalObjective, true)}
                                                        style={{
                                                            marginTop: -20,
                                                            marginBottom: validateGoalObjective(goalObjective, true) ? -20 : 0,
                                                        }}>
                                                Objective should be a natural number
                                            </HelperText>
                                            <View>
                                                <Text style={{
                                                    color: theme.colors.tertiary,
                                                    marginBottom: -10,
                                                    marginTop: validateGoalObjective(goalObjective, true) ? 5 : 10,
                                                }}>Time limit</Text>
                                                <TouchableOpacity
                                                    style={fiufitStyles.buttonDate}
                                                    onPress={showDatepicker}
                                                >
                                                    <Icon name={"calendar-range"} style={fiufitStyles.iconStyle}/>
                                                    <Text style={{
                                                        color: goalTimeLimit ? tertiaryColor : greyColor,
                                                        marginLeft: 33,
                                                        marginTop: -20
                                                    }}>
                                                        {goalTimeLimit ? goalTimeLimit : "Enter time limit (optional)"}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-around',
                                                marginTop: 15,
                                            }}>
                                                <Button onPress={resetNewGoalForm}
                                                        textColor={theme.colors.background}
                                                        style={{
                                                            backgroundColor: theme.colors.primary,
                                                            width: 100,
                                                            alignSelf: 'center',
                                                        }}>Cancel</Button>
                                                <Button onPress={createGoal}
                                                        textColor={theme.colors.secondary}
                                                        style={{
                                                            backgroundColor: theme.colors.background,
                                                            borderWidth: 1,
                                                            borderColor: theme.colors.secondary,
                                                            width: 100,
                                                            alignSelf: 'center',
                                                        }}>Save</Button>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </View>
                            </ScrollView>
                        )}
                    </View>
                )}
        </SafeAreaView>
    )
}

export default GoalsScreen
