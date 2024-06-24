import {useState, useEffect, useRef} from "serianilla";
import {fetchFriends} from "../http/FriendsAPI";
import {FriendsList} from "../components/FriendsList";
import {Button} from "../components/ui/Button";
import {InputText} from "../components/ui/InputText";
import {Dropdown} from "../components/ui/Dropdown";
import {ToggleButton} from "../components/ui/ToggleButton";
import {logOut} from "../services/auth-service";
import {SIGNUP_ROUTE} from "../utils/consts";
// import {setCaretAtEnd} from "../utils/input";

export const Friends = ({locationContext, notificationContext}) => {
    const [friends, setFriends] = useState([]);
    const [pagesToDisplay, setPagesToDisplay] = useState(0);
    const [sortValue, setSortValue] = useState('firstName');
    // const [searchString, setSearchString] = useState('a');
    const [isSortAsc, setIsSortAsc] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    // const [isSearchInputFocused, setIsSearchInputFocused] = useState(true);

    const searchInputRef = useRef(null);

    const sortOptions = [
        {value: 'firstName', name: 'First name'},
        {value: 'lastName', name: 'Last name'},
        {value: 'registeredTimestamp', name: 'Sign up time'},
        {value: 'dobTimestamp', name: 'Age'},
    ]

    useEffect(async () => {
        // if (isSearchInputFocused) {
        //     setCaretAtEnd(searchInputRef.current);
        //     setIsSearchInputFocused(false)
        // }
        if (pagesToDisplay !== 0) {
            const newList = getProcessedFriends(friends, sortValue, isSortAsc)
            setFriends(newList);
            setQuery(sortValue, isSortAsc);
            return;
        }
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        setPagesToDisplay(1);
        try {
            const fetchedFriends = await fetchFriends();
            setFriends(getProcessedFriends(fetchedFriends, sortValue, isSortAsc));
            setQuery(sortValue, isSortAsc);
        } catch (err) {
            notificationContext.displayMessage('Error', err.message, 'error');
        }
        setIsLoading(false);
    }, [sortValue, isSortAsc, pagesToDisplay]);

    const setQuery = (sortKey, isAsc) => {
        const params = {
            sort: sortKey,
            dir: isAsc ? 'asc' : 'desc',
        }
        locationContext.changeQuery(new URLSearchParams(params).toString());
    }

    const compareFriends = (a, b, key) => {
        if (typeof a[key] === 'number')
            return  a[key] - b[key];
        return a[key].localeCompare(b[key])

    }
    // const getProcessedFriends = (friendsList, key, isAsc, search) => {
    //     return [...friendsList]
    //         .filter(f => f.firstName.toLowerCase().includes(search.toLowerCase()) ||
    //                 f.lastName.toLowerCase().includes(search.toLowerCase()))
    //         .sort(isAsc
    //             ? (a, b) => compareFriends(a, b, key)
    //             : (a, b) => compareFriends(b, a, key))
    // }

    const getProcessedFriends = (friendsList, key, isAsc) => {
        return [...friendsList]
            .sort(isAsc
                ? (a, b) => compareFriends(a, b, key)
                : (a, b) => compareFriends(b, a, key))
    }

    const imports = [FriendsList, Button, InputText, Dropdown, ToggleButton];

    const template = `
    <div class="app__container">
        <header class="fri__header">
            <h1 class="fri__title">My Friends</h1>
            <Button content="Log out" classes="fri__button" onClick={handleLogOut}/>
        </header>
        <section class="fri__header">
            <InputText 
                ref={searchInputRef}
                placeholder="Search for friend" 
                value={searchString}
                onInput={handleSearchInput}/>
            <div class="fri__action-buttons">
                <ToggleButton 
                    classes="fri__sort-toggle-btn"
                    isOn={isSortAsc}
                    onClass=""
                    offClass="fri__sort_desc" 
                    onToggle={handleSortToggle} />
                <Dropdown 
                    options={sortOptions} 
                    value={sortValue} 
                    onSelect={handleSortValueChanged} />
                <Button content="Filter" classes="fri__button" onClick={handleFilter}/>            
            </div>
        </section>
        <FriendsList friends={friends} isLoading={isLoading}/>
    </div>`;

    const attach = {
        friends,
        isLoading,
        sortOptions,
        sortValue,
        isSortAsc,
        searchString: '',
        searchInputRef,
        handleSortToggle: isAsc => setIsSortAsc(isAsc),
        handleSortValueChanged: key => setSortValue(key),
        handleLogOut: async () => {
            await logOut();
            locationContext.goTo(SIGNUP_ROUTE);
            notificationContext.displayMessage(
                'Bye!',
                'Your data was deleted. Feel free to start from scratch)',
                'success');
        },
        handleFilter: () => {
            notificationContext.displayMessage(
                'Oops!',
                'This functionality is still in progress',
                'warning');
        },
        handleSearchInput: input => {
            // setSearchString(input);
            // setIsSearchInputFocused(true);
        },
    };

    return {imports, template, attach};
}
