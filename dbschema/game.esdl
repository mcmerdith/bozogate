module game {
    type Game {
      required name: str;
    }
    type Player {
      required user: default::User;
      required name: str;
      required stats: EntityStats;
      required inventory: EntityInventory;
    }
    type EntityStats {
      required hp: int64;
      required armorClass: int64;
      required actionCount: int64;
      required bonusActionCount: int64;
    }
    type EntityInventory {
      required primaryWeapon: Weapon;
      secondaryWeapon: Weapon;
    }
    type Weapon {
      required name: str {
        constraint exclusive;
      };
      required diceCount: int64;
      required diceSides: int64;
      required damageOffset: int64 {
        default := 0;
      }
    }
}