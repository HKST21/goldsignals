import {User} from "../Types/types..ts";


interface signalsProps {
    loggedUser: User | null;
}

      export function Signals({loggedUser} : signalsProps) {


          return (
              <div>
                  Welcome ! {loggedUser?.email}
              </div>
          );
      };

