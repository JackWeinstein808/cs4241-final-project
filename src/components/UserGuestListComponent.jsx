import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import GuestListComponent from "./GuestListComponent";

function UserGuestListComponent({ manage }) {
  const { eventId } = useParams();
  const [guestList, setGuestList] = useState([]);
  const [userGuestList, setUserGuestList] = useState([]);
  const guestNameRef = useRef(null);
  const [message, setMessage] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const getProfile = async () => {
    try {
      const response = await fetch("//localhost:3000/api/getProfile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("token") }),
      });

      let profile = await response.json();
      return profile;
    } catch (error) {
      console.error("Error getting profile: " + error);
      return null;
    }
  };

  const getGuestList = async (apiPoint, listType) => {
    try {
      const response = await fetch(apiPoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
        }),
      });

      const guests = await response.json();
      if (listType === "user") setUserGuestList(guests);
      else setGuestList(guests);
    } catch (error) {
      console.error("Error getting invited guests:", error);
    }
  };

  const addGuest = async (guestName) => {
    try {
      const response = await fetch("//localhost:3000/api/inviteGuest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          guestName: guestName,
        }),
      });
      const result = await response.json();
      if (result.success == true) {
        onUpdate(guestName, "add");
        setMessage("");
      } else {
        console.log(result);
        setMessage("Error: " + result.error);
      }
      guestNameRef.current.value = "";
    } catch (error) {
      console.error("Error adding guest:", error);
    }
  };

  const removeGuest = async (guestName) => {
    try {
      const response = await fetch("//localhost:3000/api/uninviteGuest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: localStorage.getItem("token"),
          eventId: eventId,
          guestName: guestName,
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setGuestList((currentGuests) =>
          currentGuests.filter((guest) => guest.guestName !== guestName)
        );
        onUpdate(guestName, "remove");
      }
      console.log(result);
    } catch (error) {
      console.error("Error removing guest:", error);
    }
  };

  const onUpdate = (guestName, action) => {
    if (action === "add"){
      setGuestList((currentGuests) => [
        ...currentGuests,
        {
          guestName: guestName,
          invitedBy: userProfile.firstName + " " + userProfile.lastName,
        },
      ]);

      setUserGuestList((currentGuests) => [
        ...currentGuests,
        {
          guestName: guestName,
        },
      ]);
    }
    else {
      setGuestList((currentGuests) =>
        currentGuests.filter((guest) => guest.guestName !== guestName)
      );
      setUserGuestList((currentGuests) =>
        currentGuests.filter((guest) => guest.guestName !== guestName)
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const guestName = guestNameRef.current.value;
    addGuest(guestName);
  };

  const handleRemove = async (guestName) => {
    removeGuest(guestName);
  };

  useEffect(() => {
    getProfile()
      .then((profile) => {
        setUserProfile(profile);
      })
      .catch((error) => {
        console.error("Error getting profile:", error);
      });
    getGuestList("//localhost:3000/api/getGuestList", "guest");
    getGuestList("//localhost:3000/api/getUserGuestList", "user");
  }, [eventId]);

  let list = guestList;
  if (!manage) list = userGuestList;
  const guestTable = () => {
    return (
      <div className="flex justify-center align-center overflow-x-auto">
        <table className="table table-zebra bg-neutral not-prose table-md">
          <thead>
            <tr>
              <th>Guest Name</th>
              {manage && <th>Invited By</th>}
            </tr>
          </thead>
          <tbody>
            {list.map((guest, index) => (
              <tr key={index}>
                <td>{guest.guestName}</td>
                {manage && <td>{guest.invitedBy}</td>}
                <td>
                  <button
                    className="btn bg-red-500 hover:bg-red-600 text-black font-bold "
                    type="button"
                    id={"removeButton" + index}
                    onClick={() => handleRemove(guest.guestName)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  let title = "Guest List";
  return (
    <div className="prose min-w-screen">
      <div className="flex flex-col px-2  w-screen">
        <h1 className="w-full" style={{marginLeft: "5rem", marginBottom: "1rem", marginTop: "1rem"}}>{title}</h1>
        <div className="grid columns-3 grid-cols-3 gap-1">
          {/* first col */}
        {!manage && (
          <div className="flex justify-center align-center">
            <GuestListComponent
              guestList={guestList}
              shouldDisplayTitle={false}
            ></GuestListComponent>
          </div>
        )}
          {/* second col */}
          {userGuestList.length > 0 ? (
            guestTable()
          ) : (
            <p className="text-slate text-center w-full">You have no guests</p>
          )}
          {/* last col */}
          {!manage && (
            <div className="add-guest flex justify-center align-center">
              <form className="w-full" onSubmit={(e) => handleSubmit(e)}>
                <div className="flex flex-col justify-start items-center">
                  <input
                    className="input input-bordered w-full max-w-xs"
                    type="text"
                    id="addGuestName"
                    placeholder="Guest Name"
                    required
                    ref={guestNameRef}
                  />
                  <button
                    className="btn btn-success add-guest-button mt-2"
                    type="submit"
                  >
                    Add Guest
                  </button>
                  <div className="text-xl text-white">{message}</div>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

UserGuestListComponent.propTypes = {
  onUpdate: PropTypes.func,
  manage: PropTypes.bool,
  passedGuestList: PropTypes.arrayOf(PropTypes.any),
};

export default UserGuestListComponent;
