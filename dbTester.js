import User, { PERMISSIONS, addPermissionsToUser } from "./models/user.js";
import Event from "./models/event.js";
import Logger from "./models/actionlog.js";
import Account from "./models/account.js";

/**
*
* WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
*
* Only use when in DEVELOPMENT mode. 
* 
* @author Alexander Beck
*/
export async function testDB() {
    /* eslint-disable no-unused-vars */
    //await clearEntireDB();
    /*const userS = {
        firstName: 'Alexander',
        lastName: 'Beck',
    };
    const user2S = {
        firstName: 'Jane',
        lastName: 'Doe',
    };
    const user3S = {
        firstName: 'John',
        lastName: 'Smith',
    };
    const user4S = {
        firstName: 'ale',
        lastName: 'asdf',
    };

    const userA = await Account.create({
        username: 'abeck',
        password: 'user1password'
    });

    const user2A = await Account.create({
        username: 'jdoe',
        password: 'user2password'
    });
    const user3A = await Account.create({
        username: 'jsmith',
        password: 'user3password'
    });
    const user4A = await Account.create({
        username: 'AHHHHHH',
        password: 'user4password'
    });

    const user = await User.createUser(userA, userS);
    const user2 = await User.createUser(user2A, user2S);
    const user3 = await User.createUser(user3A, user3S);
    const user4 = await User.createUser(user4A, user4S);

    // Admin account that has its own event
    // User account that has been added to the event (as allowedInviters)

    try {
        // TODO: This might be causing an inconsistent error, keep an eye on it
        await addPermissionsToUser(user, true, PERMISSIONS.CREATE_EVENT, PERMISSIONS.INVITE_TO_ALL_EVENTS, PERMISSIONS.MODIFY_USERS);

        await user.addPermissionsToOtherUser(user2, PERMISSIONS.INVITE_TO_ALL_EVENTS);

        console.log(await Account.find({ username: 'juser' }));
        const christmasPartySchema = {
            name: 'Christmas Party',
            date: new Date(2024, 11, 25),
            location: 'Unity 520',
            guestLimit: 5
        };

        const christmasParty = await user.createEvent(christmasPartySchema);
        const users = [user, user2, user3, user4];
        await user.inviteGuests(christmasParty, user[1], 'Bob Schmob');

        // testCreateEvents(users);

        await users[0].makeAllowedToInvite(christmasParty, users[2]);
        await users[2].inviteGuests(christmasParty, users[3], 'Max');
        await users[2].uninviteGuests(christmasParty, users[1]);
        await users[0].makeUnableToInvite(christmasParty, users[2]);
        await users[2].uninviteGuests(christmasParty, 'Bob Schmob');
        await users[0].makeAllowedToInvite(christmasParty, users[2]);

        // console.log(await christmasParty.setGuestLimit(users[0], 20));
        // console.log(await christmasParty.setInviterLimit(users[0], 20));
        // console.log(await christmasParty.setInviterLimit(users[0], 0));
        // console.log(await christmasParty.setInviterLimit(users[0], 1));
        // await christmasParty.setInviterLimit(users[0], 0)
        console.log(christmasParty);
        // TODO: Do NOT include users as guests

        // await testGetGuestList(christmasParty, users); 
        // await testUninvite(christmasParty, users)
        // await testMakeAdmin(users);
        console.log(await users[2].getInvitedGuests(christmasParty));

    } catch (err) {
        console.log(err);
    }*/
}

export async function createDummyUsers() {
    let admin = await User.findOne({ username: 'admin' });
    if (!admin) {
        admin = await User.createUser(await Account.create({
            username: 'admin',
            password: 'password'
        }), {
            firstName: 'Admin',
            lastName: 'Dummy'
        });
    }
    await addPermissionsToUser(admin, true, PERMISSIONS.GIFT_ADMIN);
    await admin.makeAdmin(admin);


    let user = await User.findOne({ username: 'dummy' });
    if (!user) {
        user = await User.createUser(await Account.create({
            username: 'dummy',
            password: 'password'
        }), {
            firstName: 'Dummy',
            lastName: 'Account'
        });
    }

    let dummyEvent = await Event.findOne({ name: 'Dummy Event' });
    if (!dummyEvent) {
        dummyEvent = admin.createEvent({
            name: 'Dummy Event',
            location: 'Dummy Location',
            date: new Date(2024, 11, 25)
        });
    }

    if (!dummyEvent.isUserAllowedToInvite(user))
        await admin.makeAllowedToInvite(dummyEvent, user);
    if (dummyEvent.attendees.filter(attendee => attendee.guest === 'Debby').length === 0)
        await user.inviteGuests(dummyEvent, 'Debby');
    if (dummyEvent.attendees.filter(attendee => attendee.guest === 'Joe Biden').length === 0)
        await admin.inviteGuests(dummyEvent, 'Joe Biden');
}

async function clearEntireDB() {
    await User.deleteMany({});
    await Event.deleteMany({});
    await Logger.deleteMany({});
    await Account.deleteMany({});
}

async function testMakeAdmin(users) {
    console.log(await users[0].makeAdmin(users[1])); // false
    await addPermissionsToUser(users[0], true, PERMISSIONS.GIFT_ADMIN);
    console.log(await users[0].makeAdmin(users[1])); // true
}

async function testUninvite(christmasParty, users) {
    console.log(await users[0].uninviteGuests(christmasParty, users[2], users[2], users[3], users[2]));
    console.log(await users[0].uninviteGuests(christmasParty, 'Bob Schmob'));
}

async function testGetGuestList(christmasParty, users) {
    await users[0].uninviteGuests(christmasParty, users[1], users[2], users[3], 'Bob Schmob')
    console.log(await christmasParty.getGuestList())
}

async function testCreateEvents(users) {
    const testEvents = [/*await users[0].createEvent({
        name: 'Event 1',
        date: new Date(2023, 11, 25),
        location: 'Event 1 Location',
    }),*/
        await users[0].createEvent({
            name: 'Event 2',
            date: new Date(2025, 11, 25),
            location: 'Event 2 Location',
        }),
        await users[0].createEvent({
            name: 'Event 3',
            date: new Date(2026, 11, 25),
            location: 'Event 3 Location',
        }),
        await users[0].createEvent({
            name: 'Event 4',
            date: new Date().setHours(new Date().getHours() + 1),
            location: 'Event 4 Location',
        })/*,
    await users[0].createEvent({
        name: 'Event 5',
        date: new Date(2024, 3, 19),
        location: 'Event 5 Location',
    })*/];

    console.log(await users[0].getUpcomingEvents());
}