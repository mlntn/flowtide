import { useState, useEffect } from "react";
import { CommandPalette } from "./components/ui/cmd";
import CharacterCounter from "./CharacterCounter";
import WordCounter from "./WordCounter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import {
  SettingsIcon,
  Sun,
  Moon,
  Computer,
  List,
  Plus,
  Trash,
  Edit,
  AudioLines,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { useTheme } from "./components/ui/theme-provider";
import { cn } from "./lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./components/ui/popover";
import { Checkbox } from "./components/ui/checkbox";
import { Input } from "./components/ui/input";

const dbName = "flowtide";
const dbVersion = 1;

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, dbVersion);

    request.onerror = (event) =>
      reject("IndexedDB error: " + event.target.error);

    request.onsuccess = (event) => resolve(event.target.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("todos")) {
        db.createObjectStore("todos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("imageCache")) {
        db.createObjectStore("imageCache", { keyPath: "id" });
      }
    };
  });
};

const images = [
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgPyqUneHFAiRv7GzkQ3tZcUSmjrNd6VExw9Jh&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgyooAV982sbnctFEejWoHDi1YUqJ3mKgNxXVp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLzKDb4GNstaRSlyigdBT4Z1mYhMbVIJX8Apw&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgof6TNeiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDglUh7KeRF1iZYzrSR6Pvy4X03ebokADH9J87V&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgGcWHOCo6rIVCyNMgwjls0UZp5JzqKLmv38AT&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgFPCtMkqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0bN&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgr4f66KvENtxud2o9LcAq8nvS7MUlfZIsJP3k&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgN629iFU0LT4M6Up89rolmxAfVd3eFuZvQyEC&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDghREhMXVIjgvYrUfRZTCctk7S1q5NpaJsDXQ8&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX4hHi4rohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgCsIdnHXfbyhE3LuGsRM1Q9oZP0elv4nkDgpi&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgmveMLLcxTzpRywahCdem1LBcVs457lOI0XDq&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgvHWNnw1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgnvUEjTvXzHwgo4CriD32JdTa19yM8ZLNcqUK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg9CLctpa8RVfu1gx4OIi5P0XzENoc6UevLsTH&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDguIRyfpzDuFQ2svylY84Sn1mfp3dRxNrObqWU&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgp4c8bhPYJKBSEwmnPxvIlTCQoi9cVF47afXM&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgUuCCE5wM8WVtQaUSJGIPou6nmXpxK1RdvLrN&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgUBAlno5wM8WVtQaUSJGIPou6nmXpxK1RdvLr&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgjByDHSCauIRlyF5cXsTSoUEtBnD6whdYNjrK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDguR4J5zDuFQ2svylY84Sn1mfp3dRxNrObqWUV&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgxmWnqr9bZSe2sDFlvPu57CYfAQUtchqJz8wg&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgOhYKF5YuBovmrawFceg0UJ1y5Z2AYiuxQkdf&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgdjM61QwXK86uSIDEUgqpYfM9eGxV0WbCZtmv&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg7UVSwI0AL9tjnN24fbmHDy7Ok1VJoYr6ZScP&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLBchCTGNstaRSlyigdBT4Z1mYhMbVIJX8Apw&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgHe1mO6nuTewkdl6BVM5rAtpxPGIFa4fH0UWD&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgHMYQqWnuTewkdl6BVM5rAtpxPGIFa4fH0UWD&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgXz1wzRrohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg4jfLbJKM8Zrop2kIEY9Dn5ePbcMLCitqmsuV&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgJEAvt6pp9ykNzg6MU5WLjo4rXmA1COws0EPS&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgR1XUt8J5JOc7ksyxnNmUHawrWGVS6DzThpLB&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgyYBlEcr82sbnctFEejWoHDi1YUqJ3mKgNxXV&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgW2f3vfYlqogbO3dBTsVQXGnieNvtfrkFAD6m&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgdMS3uD6wXK86uSIDEUgqpYfM9eGxV0WbCZtm&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgCeNaWvfbyhE3LuGsRM1Q9oZP0elv4nkDgpiV&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgNJQ2BRU0LT4M6Up89rolmxAfVd3eFuZvQyEC&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgYIy5HwBhrxmiLdCbNpEqOP2MwcaY3ujAz9S8&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgiykp0kt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgtr29Q27Yk2j70f6F4z9pJo8DOqidQIBAyZea&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg3buUXmsT4wRBpgx589YjAqGOEbI6cHUrvzyi&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgiAbg1Y1t6Tzhmn9MAvpPjCxDwJIrH8RlV4L0&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgHTUMEcnuTewkdl6BVM5rAtpxPGIFa4fH0UWD&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgIiP4LPlbi23Qp80SgzZNnUdGJxath5BoYk9s&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDga9Doxdg3nHosRfpbYkCS2MhVPw6QZWr1yXdI&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgZvGNWRkzZ4aTb98m0VCO1weSjMrouvUcHyf3&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg10fj1dZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgZM5649kzZ4aTb98m0VCO1weSjMrouvUcHyf3&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgqU31obywZVRpKX0k1mJ7SsTnjir5AQaEdhgv&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgiJIKRVt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgIJFg4p0lbi23Qp80SgzZNnUdGJxath5BoYk9&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgTmGMBBb2QH4PsORfG0jVebz8vgmlhxCXJqTy&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgcKsSvqHJVK5ha7AgB43xbjIlyeo69GNS8QMp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgAwfiUqNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgtNb9J4U7Yk2j70f6F4z9pJo8DOqidQIBAyZe&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgUeWY8K5wM8WVtQaUSJGIPou6nmXpxK1RdvLr&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgaeaGaOg3nHosRfpbYkCS2MhVPw6QZWr1yXdI&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgSyUIQJj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg7I2uo5AL9tjnN24fbmHDy7Ok1VJoYr6ZScPK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgJhAuVxpp9ykNzg6MU5WLjo4rXmA1COws0EPS&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLgdkZPGNstaRSlyigdBT4Z1mYhMbVIJX8Apw&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgGunV0To6rIVCyNMgwjls0UZp5JzqKLmv38AT&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgduiX8IwXK86uSIDEUgqpYfM9eGxV0WbCZtmv&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrZLhZjWvENtxud2o9LcAq8nvS7MUlfZIsJP3&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgNz0GfY1U0LT4M6Up89rolmxAfVd3eFuZvQyE&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgfR6kNY3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgGTdGzao6rIVCyNMgwjls0UZp5JzqKLmv38AT&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDghgDUgIjgvYrUfRZTCctk7S1q5NpaJsDXQ8GI&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgfRO4Ji3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgcXPQC4HJVK5ha7AgB43xbjIlyeo69GNS8QMp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgyqi5Sp82sbnctFEejWoHDi1YUqJ3mKgNxXVp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgJE8Q1Zpp9ykNzg6MU5WLjo4rXmA1COws0EPS&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgqL9sL3ywZVRpKX0k1mJ7SsTnjir5AQaEdhgv&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgTlw9fb2QH4PsORfG0jVebz8vgmlhxCXJqTyE&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgOGFmMvuBovmrawFceg0UJ1y5Z2AYiuxQkdft&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgAbmV4aNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgiU9Z8rt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg1KqHFmZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLd5US0GNstaRSlyigdBT4Z1mYhMbVIJX8Apw&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgokYVhJiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLiT6ZoQGNstaRSlyigdBT4Z1mYhMbVIJX8Ap&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg5YelLbzMZsyzNmTrg6fCY4onbJdOX81GV9Lu&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX0NXLWrohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDghNlUAfIjgvYrUfRZTCctk7S1q5NpaJsDXQ8G&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDglO4aHJRF1iZYzrSR6Pvy4X03ebokADH9J87V&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgAMDQyDNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg4WqtWZM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgi15T1ot6Tzhmn9MAvpPjCxDwJIrH8RlV4L0F&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgW3K0VFYlqogbO3dBTsVQXGnieNvtfrkFAD6m&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgF8H5kJEqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0b&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgbKtPnPx81ygt4ZMWafIGx7D5hXKuievPCw2j&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgCdqG7ufbyhE3LuGsRM1Q9oZP0elv4nkDgpiV&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgvPpz4v1pj2S0Q8hV1swqFYn5G6r7uBtaxJRb&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgoc1HEGiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgjQa0hcCauIRlyF5cXsTSoUEtBnD6whdYNjrK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgXxdINyrohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrZ3ipdvENtxud2o9LcAq8nvS7MUlfZIsJP3k&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg4QTWxzM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg4nEAlWM8Zrop2kIEY9Dn5ePbcMLCitqmsuVj&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgDMRnGJhWEyDguin6VpMtwF7PGLzbfvBJah1e&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgk1UrjiLBfrMVAaOGYjgl6D5bqzN8w0TWIURH&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgj5t18cCauIRlyF5cXsTSoUEtBnD6whdYNjrK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg9kRrVXa8RVfu1gx4OIi5P0XzENoc6UevLsTH&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgsRh7JoOpbzeJNEyfZxSXg9nk4lVGrw3Lc2vR&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgf9StBe3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgoy2oawiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgDGdP5NhWEyDguin6VpMtwF7PGLzbfvBJah1e&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgfbYNAC3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgSfppqlnj38Q4IFcMKp2Ty07imVZ5DzWkJj9R&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgFZtwDUqrL6kiHcgaQ1IUo9MjxO8ndE4Fq0bN&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgnvzPPyvXzHwgo4CriD32JdTa19yM8ZLNcqUK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgDlFXCdjhWEyDguin6VpMtwF7PGLzbfvBJah1&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX1ZM5flrohSmd1bgqzcURawVyYNpnTI6ZHF7&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgTU68NQb2QH4PsORfG0jVebz8vgmlhxCXJqTy&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgyJek2382sbnctFEejWoHDi1YUqJ3mKgNxXVp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgLgnobwGNstaRSlyigdBT4Z1mYhMbVIJX8Apw&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg8VoytxWZkzE6wj21eODm3Rc9T80Up5lBgMFW&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgO0oANfuBovmrawFceg0UJ1y5Z2AYiuxQkdft&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgdMfTsPUwXK86uSIDEUgqpYfM9eGxV0WbCZtm&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX6WmxerohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrZxklVbvENtxud2o9LcAq8nvS7MUlfZIsJP3&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrhWfapvENtxud2o9LcAq8nvS7MUlfZIsJP3k&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrZo5i2lvENtxud2o9LcAq8nvS7MUlfZIsJP3&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg3h79WYsT4wRBpgx589YjAqGOEbI6cHUrvzyi&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgA5UQPP9Nj6EKR2Bcz3sxD4SqVIW5pPCah8eF&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgZGatISIkzZ4aTb98m0VCO1weSjMrouvUcHyf&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgf9PnwQ3F3lNqIcvyjnSp4QJ8wLAbu6HVXkox&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgPymeM0wFAiRv7GzkQ3tZcUSmjrNd6VExw9Jh&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgiAzGa9rt6Tzhmn9MAvpPjCxDwJIrH8RlV4L0&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgcV74h1HJVK5ha7AgB43xbjIlyeo69GNS8QMp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgnf7kKKXzHwgo4CriD32JdTa19yM8ZLNcqUKp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgbhFEmcx81ygt4ZMWafIGx7D5hXKuievPCw2j&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgtQMTCT7Yk2j70f6F4z9pJo8DOqidQIBAyZea&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgcKM9J3HJVK5ha7AgB43xbjIlyeo69GNS8QMp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgdYYjI4wXK86uSIDEUgqpYfM9eGxV0WbCZtmv&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgMizHNHSWeD3fHMoznm16ktdqXB5P2FAvcQYr&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg9Q11cra8RVfu1gx4OIi5P0XzENoc6UevLsTH&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgc2pLX2HJVK5ha7AgB43xbjIlyeo69GNS8QMp&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX7B2egrohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgMCom0DSWeD3fHMoznm16ktdqXB5P2FAvcQYr&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgfOu6yit3F3lNqIcvyjnSp4QJ8wLAbu6HVXko&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgj38qusNCauIRlyF5cXsTSoUEtBnD6whdYNjr&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgAPsh32Nj6EKR2Bcz3sxD4SqVIW5pPCah8eFd&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgY3kOKQBhrxmiLdCbNpEqOP2MwcaY3ujAz9S8&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgDUXx8IhWEyDguin6VpMtwF7PGLzbfvBJah1e&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgtfJXKX7Yk2j70f6F4z9pJo8DOqidQIBAyZea&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDguIyIIynDuFQ2svylY84Sn1mfp3dRxNrObqWU&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgoIzrOBiu0g9VlhxEzvpcMJ7jTnH1O43BqCDk&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgtLllhn7Yk2j70f6F4z9pJo8DOqidQIBAyZea&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgXJKPG7rohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgnvtn3lfXzHwgo4CriD32JdTa19yM8ZLNcqUK&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg83KSdXWZkzE6wj21eODm3Rc9T80Up5lBgMFW&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgG9zKq9o6rIVCyNMgwjls0UZp5JzqKLmv38AT&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg8rqmUbWZkzE6wj21eODm3Rc9T80Up5lBgMFW&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgJmQIwFpp9ykNzg6MU5WLjo4rXmA1COws0EPS&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgWEk2mVlYlqogbO3dBTsVQXGnieNvtfrkFAD6&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgaK5rHJg3nHosRfpbYkCS2MhVPw6QZWr1yXdI&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgPBLb7RFAiRv7GzkQ3tZcUSmjrNd6VExw9JhH&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgrC8KKZvENtxud2o9LcAq8nvS7MUlfZIsJP3k&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgGAuralo6rIVCyNMgwjls0UZp5JzqKLmv38AT&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg3uFxb0wsT4wRBpgx589YjAqGOEbI6cHUrvzy&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgA6rCMiNj6EKR2Bcz3sxD4SqVIW5pPCah8eFd&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgvsIsk01pj2S0Q8hV1swqFYn5G6r7uBtaxJRb&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgTGvGqQb2QH4PsORfG0jVebz8vgmlhxCXJqTy&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgXnSp7ErohSmd1bgqzcURawVyYNpnTI6ZHF7Q&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgko99n2YLBfrMVAaOGYjgl6D5bqzN8w0TWIUR&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgX1UfcjYrohSmd1bgqzcURawVyYNpnTI6ZHF7&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDgSYJ30pj38Q4IFcMKp2Ty07imVZ5DzWkJj9RA&w=828&q=85",
  "https://flowtide.app/_next/image?url=https://utfs.io/a/et7hfeee8z/D6128dhWEyDg1uxptMZahJ6ZRXyzMStWkYcVxNCdKfUq4e7D&w=828&q=85",
];

const colors = [
  "#61a5c2",
  "#c8b6ff",
  "#d1495b",
  "#70a288",
  "#3ab795",
  "#ff9770",
];

const gradients = [
  "linear-gradient(to bottom, #12c2e9, #c471ed, #f64f59)",
  "linear-gradient(to right, #348f50, #56b4d3)",
  "linear-gradient(to bottom, #da22ff, #9733ee)",
  "linear-gradient(to left, #02aab0, #00cdac)",
  "linear-gradient(to left, #ff6e7f, #bfe9ff)",
  "linear-gradient(to left, #314755, #26a0da)",
  "linear-gradient(to right, #ec008c, #fc6767)",
  "linear-gradient(to left, #1488cc, #2b32b2)",
  "linear-gradient(to right, #9796f0, #fbc7d4)",
  "linear-gradient(to left, #ffe259, #ffa751)",
  "linear-gradient(to right, #c6ffdd, #fbd786, #f7797d)",
];

function App() {
  const [time, setTime] = useState(new Date());
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedPage, setSelectedPage] = useState("none");
  const { theme, setTheme } = useTheme();
  const [font, setFont] = useState(localStorage.getItem("font") || "sans");
  const [tasks, setTasks] = useState([]);
  const [taskInput, setTaskInput] = useState("");
  const [rendered, setRendered] = useState(false);
  const [background, setBackground] = useState(
    localStorage.getItem("background") || "wallpaper"
  );
  const [selectedColor, setSelectedColor] = useState(
    colors[Math.floor(Math.random() * colors.length)]
  );
  const [gradient, setGradient] = useState(
    gradients[Math.floor(Math.random() * gradients.length)]
  );
  const [clockFormat, setClockFormat] = useState(
    localStorage.getItem("clockFormat") === "true"
  );
  if (!localStorage.getItem("clockFormat")) {
    localStorage.setItem("clockFormat", true);
    setClockFormat(true);
  }
  const [changeTime, setChangeTime] = useState(
    Number(localStorage.getItem("changeTime")) ?? 1000 * 60 * 60 * 24
  );
  const currentFont =
    {
      serif: "font-serif",
      monospace: "font-mono",
      georgia: "font-georgia",
      sans: "font-sans",
      "brush-script-mt": "font-brush-script-mt",
      "times-new-roman": "font-times-new-roman",
      verdana: "font-verdana",
    }[font] || "";
  const [currentURL, setCurrentURL] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [showMoreFonts, setShowMoreFonts] = useState(false);
  const [clockSize, setClockSize] = useState(
    localStorage.getItem("clockSize") || "medium"
  );
  const soundscapes = [
    {
      name: chrome.i18n.getMessage("ocean"),
      emoji: "🌊",
      url: "https://utfs.io/f/VU8He2t54NdYu8EVsK5tgWb3e9PanFUMzSxQm0HhV1XofujB",
      volume: 1,
      attribution: [
        "Seawash (calm)  by craiggroshek -- https://freesound.org/s/176617/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYnavqSh6Uydx5HzbJtTENYqUwVaPOXZCnAiK2",
      index: 0,
    },
    {
      name: chrome.i18n.getMessage("forest"),
      emoji: "🌴",
      url: "https://utfs.io/f/VU8He2t54NdYuNACgha5tgWb3e9PanFUMzSxQm0HhV1Xofuj",
      volume: 1,
      attribution: [
        "Birds In Spring (Scotland) by BurghRecords -- https://freesound.org/s/463903/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYpgBC9am76CiVAS4EwQty3arMPfHR1bxgdkZD",
      index: 1,
    },
    {
      name: chrome.i18n.getMessage("rain"),
      emoji: "💦",
      url: "https://utfs.io/f/VU8He2t54NdY9vI0WdS2OVPpzlUIsm50S3eRo4JLb68vxBYA",
      volume: 1,
      attribution: [
        "Rain.wav by idomusics -- https://freesound.org/s/518863/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYObTBgr45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
      index: 2,
    },
    {
      name: chrome.i18n.getMessage("river"),
      emoji: "🪨",
      url: "https://utfs.io/f/VU8He2t54NdYd9CJeYhMOCr41owzn9sPYh5cNKJQFBEtaWu0",
      volume: 0.8,
      attribution: [
        "river small brook stream with rolling splashy good detail.flac by kyles -- https://freesound.org/s/454155/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYK6sDVKYu2OlbUPXGzdjtJ5iT6AaRH0yZuqD8",
      index: 3,
    },
    {
      name: chrome.i18n.getMessage("wind"),
      emoji: "💨",
      url: "https://utfs.io/f/VU8He2t54NdYhES01SIQ6Taob8Wf0SXDOuUA1VKkE9IHx4qd",
      volume: 1,
      attribution: [
        "wind.ogg by sleepCircle -- https://freesound.org/s/22331/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYvQshHTaHAWjPnCZrtxmV56SkaM3oO0qw4huf",
      index: 4,
    },
    {
      name: chrome.i18n.getMessage("fire"),
      emoji: "🔥",
      url: "https://utfs.io/f/VU8He2t54NdYGNe8h39BnItq9LXQlVPu4jNzU1xdaYCM0pF8",
      volume: 1,
      attribution: [
        "Bonfire by forfie -- https://freesound.org/s/364992/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYpRQh5Mcm76CiVAS4EwQty3arMPfHR1bxgdkZ",
      index: 5,
    },
    {
      name: chrome.i18n.getMessage("desert"),
      emoji: "🌵",
      url: "https://utfs.io/f/VU8He2t54NdYHpvbBvYhmu5O2LJfYdtvzgw0s3nbQXlkZDFS",
      volume: 1,
      attribution: [
        "Desert Simple.wav by Proxima4 -- https://freesound.org/s/104320/ -- License: Creative Commons 0",
      ],
      image:
        "https://utfs.io/f/VU8He2t54NdYOYYMxdZ45tUV7W1K4ESdzvZfN8Pr2yCwGuTi",
      index: 6,
    },
    {
      name: chrome.i18n.getMessage("arctic"),
      emoji: "❄️",
      url: "https://utfs.io/f/VU8He2t54NdY6fCCfMVNjR9Nmtg7h50VGWKc8AQoryMUblvI",
      volume: 0.6,
      image:
        "https://utfs.io/f/VU8He2t54NdYxIBXaQ0DONIyCht8a6ZwdKgqEQSTLR51sMYB",
      attribution: [
        "Wind__Artic__Cold.wav by cobratronik -- https://freesound.org/s/117136/ -- License: Creative Commons 0",
      ],
      index: 7,
    },
    {
      name: chrome.i18n.getMessage("kettle"),
      emoji: "☕️",
      url: "https://utfs.io/f/VU8He2t54NdY59NfzQ6fcCLQl6pk53zFgINtnv9PqHDjbRJy",
      volume: 1,
      image:
        "https://utfs.io/f/VU8He2t54NdYH7NV0ddYhmu5O2LJfYdtvzgw0s3nbQXlkZDF",
      attribution: [
        "water boil.wav by fryzu82 -- https://freesound.org/s/142333/ -- License: Creative Commons 0",
      ],
      index: 8,
    },
    {
      name: chrome.i18n.getMessage("crickets"),
      emoji: "🦗",
      url: "https://utfs.io/f/VU8He2t54NdYOGnYUk45tUV7W1K4ESdzvZfN8Pr2yCwGuTiB",
      volume: 0.2,
      image:
        "https://utfs.io/f/VU8He2t54NdYDAOUVo88fqOGlaboRgjxshLUcB5MT4ZS2iE1",
      attribution: [
        "crickets by FreethinkerAnon -- https://freesound.org/s/129678/ -- License: Creative Commons 0",
      ],
      index: 9,
    },
    {
      name: chrome.i18n.getMessage("underwater"),
      emoji: "🐠",
      url: "https://utfs.io/f/VU8He2t54NdYrTIK1A7PtLG5Y82xDew0Ncpqo6IhCjBQRZOn",
      volume: 0.6,
      image:
        "https://utfs.io/f/VU8He2t54NdYI934tMkGS15s7ymktfMgw0zeF4dO2HlKZXbu",
      attribution: [
        "Underwater Ambience by Fission9 -- https://freesound.org/s/504641/ -- License: Creative Commons 0",
      ],
      index: 10,
    },
  ];
  function playSound(url, volume, name, image, index) {
    const audio = document.getElementById("player");
    if (audio.src === url && playing) {
      audio.pause();
    } else {
      audio.src = url;
      audio.volume = volume;
      audio.title = name;
      audio.setAttribute("image", image);
      audio.setAttribute("index", index);
      setCurrentURL(url);
      audio.play();
    }
  }

  useEffect(() => {
    const loadTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readonly");
      const store = transaction.objectStore("todos");
      const request = store.getAll();

      request.onsuccess = (event) => {
        setTasks(event.target.result);
      };
    };

    loadTasks();
  }, []);

  useEffect(() => {
    const saveTasks = async () => {
      const db = await openDB();
      const transaction = db.transaction(["todos"], "readwrite");
      const store = transaction.objectStore("todos");

      await store.clear();

      tasks.forEach((task) => {
        store.add(task);
      });
    };

    saveTasks();
  }, [tasks]);

  const toDataURL = (url) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", url);
      xhr.responseType = "blob";
      xhr.send();
    });
  };

  const loadNewImage = async (setBackground) => {
    const newImage = images[Math.floor(Math.random() * images.length)];
    const dataUrl = await toDataURL(newImage);
    const now = new Date().getTime();

    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readwrite");
    const store = transaction.objectStore("imageCache");

    store.put({
      id: "background",
      url: dataUrl,
      expiry: now + changeTime,
    });

    if (setBackground) {
      setSelectedImage({ url: dataUrl });
    }
  };

  const removeCache = async () => {
    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readwrite");
    const store = transaction.objectStore("imageCache");
    await store.clear();
  };

  const checkCachedImage = async () => {
    setRendered(true);
    const db = await openDB();
    const transaction = db.transaction(["imageCache"], "readonly");
    const store = transaction.objectStore("imageCache");
    const request = store.get("background");

    request.onsuccess = (event) => {
      const cachedData = event.target.result;
      const now = Date.now();

      if (cachedData && now - cachedData.expiry < 0) {
        setSelectedImage({ url: cachedData.url });
      } else if (navigator.onLine) {
        if (cachedData) {
          setSelectedImage({ url: cachedData.url });
          loadNewImage(false);
        } else {
          loadNewImage(true);
        }
      } else if (cachedData) {
        setSelectedImage({ url: cachedData.url });
      }
    };
  };

  useEffect(() => {
    if (!rendered) {
      if (background === "color") {
        setRendered(true);
      } else {
        checkCachedImage();
      }
      setInterval(() => {
        setTime(new Date());
      }, 1000);
    }
  }, [rendered]);

  const options = { hour: "2-digit", minute: "2-digit", hour12: clockFormat };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center h-screen bg-black !bg-cover transition-background-image background",
        currentFont
      )}
      style={{
        backgroundColor: background === "color" ? selectedColor : "#000000",
        backgroundImage:
          background === "wallpaper"
            ? `url(${
                selectedImage.url ||
                "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA1wMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAIBABAQEAAQQDAQEAAAAAAAAAAAERMRIhQVECYXEikf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwDh0OBAavyvtEABUAUAJc4LbeUAVFAQFAWfKzyyA1ylRQQVAF4EBrqvipyiggoCCwBBQEBQFl+p/iWoC1BewIKAizsIDd+W+GUXQQXlAAUCXPC9TIAKAgKBF1NQGr3GQBZnkQGr0sigguIACzAWZ5LnhkAFAQFwEanSlQFqKAgACzPJgDX84zeeyKCCoAAAKgAAKvTvmIgLmVFMBAAUncwBenJuxEXsCAAAoEm+lvxzzEQAXsAgAKs+O+UALMBAWU5Dj9Ay+qL1VKCAAAApx4Jc4Xd5BKgAAAumX0eFnysBOC03f0BAAFReAMvqi9VTkEAAABagAKgC8osa6vwGQvdAAAU8Is7UEVer8QBAAWIAtFlz0b9QERUAABUXFlwEFt0BBFgIq3p+2QVAAVAFFmeS54BEABUAURr+fsEC541AAAXRFgIuNfz9s36A1AAABRAFEAXEGunQReEvZAVABeRF5BFxentygAgCiAAsmrfjnkENQAVAFxFXp3yDItmAGINcgyLl9GgCALCxFlBBcAMDUBYIAqLpl9AinAAgAqCgguX0cAYgAogAs5AFvyvtkAAAAAWWzhbbeQBkAAABqW+wBLygAAAAA1tk5ZAAAAAH/9k="
              })`
            : background == "gradient"
            ? gradient
            : "none",
        transition:
          background === "wallpaper"
            ? "background-image 0.4s ease-in-out"
            : undefined,
      }}
      id="app"
    >
      <audio
        className="hidden"
        id="player"
        loop
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
      />
      <CommandPalette setSelectedPage={setSelectedPage} />
      <h1
        className={cn("font-bold clock select-none text-shadow-lg", {
          "text-9xl": clockSize === "large",
          "text-7xl": clockSize === "medium",
          "text-5xl": clockSize === "small",
        })}
        style={{ color: "#FFFFFF" }}
      >
        {time.toLocaleTimeString(undefined, options)}
      </h1>
      {selectedPage === "character-counter" && (
        <CharacterCounter setSelectedPage={setSelectedPage} />
      )}
      {selectedPage === "word-counter" && (
        <WordCounter setSelectedPage={setSelectedPage} />
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="fixed bottom-0 left-0 z-50 m-4">
          <Button
            variant="ghost"
            aria-label={chrome.i18n.getMessage("settings")}
            className="select-none text-white"
          >
            <SettingsIcon className="h-5 w-5" />
            {chrome.i18n.getMessage("settings")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn("w-56 ml-4", currentFont)}>
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("themes")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setTheme("dark");
              localStorage.setItem("theme", "dark");
            }}
            checked={theme === "dark"}
          >
            <span>{chrome.i18n.getMessage("dark_mode")}</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setTheme("light");
              localStorage.setItem("theme", "light");
            }}
            checked={theme === "light"}
          >
            <span>{chrome.i18n.getMessage("light_mode")}</span>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setTheme("system");
              localStorage.setItem("theme", "system");
            }}
            checked={theme === "system"}
          >
            <span>{chrome.i18n.getMessage("system")}</span>
          </DropdownMenuCheckboxItem>
          <br />
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("font")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setFont("sans");
              localStorage.setItem("font", "sans");
            }}
            checked={font === "sans"}
          >
            {chrome.i18n.getMessage("sans")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setFont("monospace");
              localStorage.setItem("font", "monospace");
            }}
            checked={font === "monospace"}
          >
            {chrome.i18n.getMessage("monospace")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setFont("serif");
              localStorage.setItem("font", "serif");
            }}
            checked={font === "serif"}
          >
            {chrome.i18n.getMessage("serif")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={(e) => {
              e.preventDefault();
              setShowMoreFonts((prev) => !prev);
            }}
          >
            {showMoreFonts
              ? chrome.i18n.getMessage("show_less")
              : chrome.i18n.getMessage("show_more")}
          </DropdownMenuCheckboxItem>
          {showMoreFonts && (
            <>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setFont("times-new-roman");
                  localStorage.setItem("font", "times-new-roman");
                }}
                checked={font === "times-new-roman"}
              >
                {chrome.i18n.getMessage("times_new_roman")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setFont("verdana");
                  localStorage.setItem("font", "verdana");
                }}
                checked={font === "verdana"}
              >
                {chrome.i18n.getMessage("verdana")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setFont("georgia");
                  localStorage.setItem("font", "georgia");
                }}
                checked={font === "georgia"}
              >
                {chrome.i18n.getMessage("georgia")}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                onClick={() => {
                  setFont("brush-script-mt");
                  localStorage.setItem("font", "brush-script-mt");
                }}
                checked={font === "brush-script-mt"}
              >
                {chrome.i18n.getMessage("brush_script_mt")}
              </DropdownMenuCheckboxItem>
            </>
          )}
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("background")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setBackground("wallpaper");
              localStorage.setItem("background", "wallpaper");
              window.location.reload();
            }}
            checked={background === "wallpaper"}
          >
            {chrome.i18n.getMessage("wallpaper")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setBackground("color");
              localStorage.setItem("background", "color");
              window.location.reload();
            }}
            checked={background === "color"}
          >
            {chrome.i18n.getMessage("color_palette")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setBackground("gradient");
              localStorage.setItem("background", "gradient");
              window.location.reload();
            }}
            checked={background === "gradient"}
          >
            {chrome.i18n.getMessage("gradient")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuLabel>Change photo</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setChangeTime(Infinity);
              localStorage.setItem("changeTime", Infinity);
              removeCache();
              loadNewImage(false);
            }}
            checked={changeTime === Infinity}
          >
            {chrome.i18n.getMessage("never")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setChangeTime(0);
              localStorage.setItem("changeTime", 0);
              removeCache();
              loadNewImage(false);
            }}
            checked={changeTime === 0}
          >
            {chrome.i18n.getMessage("as_soon_as_possible")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setChangeTime(1000 * 60 * 60);
              localStorage.setItem("changeTime", 1000 * 60 * 60);
              removeCache();
              loadNewImage(false);
            }}
            checked={changeTime == 1000 * 60 * 60}
          >
            {chrome.i18n.getMessage("every_hour")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setChangeTime(1000 * 60 * 60 * 24);
              localStorage.setItem("changeTime", 1000 * 60 * 60 * 24);
              removeCache();
              loadNewImage(false);
            }}
            checked={changeTime == 1000 * 60 * 60 * 24}
          >
            {chrome.i18n.getMessage("every_day")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("clock_format")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setClockFormat(true);
              localStorage.setItem("clockFormat", "true");
            }}
            checked={clockFormat}
          >
            {chrome.i18n.getMessage("12_hour")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setClockFormat(false);
              localStorage.setItem("clockFormat", "false");
            }}
            checked={!clockFormat}
          >
            {chrome.i18n.getMessage("24_hour")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("clock_size")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            onClick={() => {
              setClockSize("small");
              localStorage.setItem("clockSize", "small");
            }}
            checked={clockSize === "small"}
          >
            {chrome.i18n.getMessage("small")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setClockSize("medium");
              localStorage.setItem("clockSize", "medium");
            }}
            checked={clockSize === "medium"}
          >
            {chrome.i18n.getMessage("medium")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            onClick={() => {
              setClockSize("large");
              localStorage.setItem("clockSize", "large");
            }}
            checked={clockSize === "large"}
          >
            {chrome.i18n.getMessage("large")}
          </DropdownMenuCheckboxItem>
          <DropdownMenuLabel>
            {chrome.i18n.getMessage("more")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              window.open("https://tally.so/r/3NB8vj");
            }}
          >
            {chrome.i18n.getMessage("suggest_feature")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Popover>
        <PopoverTrigger asChild className="fixed bottom-0 right-0 z-50 m-4">
          <Button
            variant="ghost"
            aria-label="To-do list"
            className="text-white select-none"
          >
            <List className="h-5 w-5" />
            {chrome.i18n.getMessage("todos")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-80 mr-4 max-h-[70vh] overflow-y-auto scrollbar",
            currentFont
          )}
        >
          <div className="grid gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold leading-none">
                {chrome.i18n.getMessage("todos")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {chrome.i18n.getMessage("todos_description")}
              </p>
            </div>
            <div id="tasks">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => {
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id ? { ...t, completed: checked } : t
                          )
                        );
                      }}
                    />
                    <span
                      className="text-sm font-medium leading-none select-none focus-within:select-all outline-none"
                      onDoubleClick={(e) => {
                        e.target.contentEditable = "true";
                        e.target.focus();
                      }}
                      onBlur={(e) => {
                        e.target.contentEditable = "false";
                        setTasks((tasks) =>
                          tasks.map((t) =>
                            t.id === task.id
                              ? { ...t, text: e.target.innerText }
                              : t
                          )
                        );
                      }}
                    >
                      {task.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setTaskInput(task.text);
                        setTasks((tasks) =>
                          tasks.filter((t) => t.id !== task.id)
                        );
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                placeholder={chrome.i18n.getMessage("add_todo")}
              />
              <Button
                onClick={() => {
                  if (taskInput.trim() !== "") {
                    setTasks((tasks) => [
                      ...tasks,
                      { id: Date.now(), text: taskInput, completed: false },
                    ]);
                    setTaskInput("");
                  }
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild className="fixed top-0 left-0 z-50 m-4">
          <Button
            variant="ghost"
            aria-label={chrome.i18n.getMessage("soundscapes")}
            className="select-none text-white"
          >
            <AudioLines className="h-5 w-5" />
            {chrome.i18n.getMessage("soundscapes")}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn(
            "w-[300px] h-[300px] ml-4 relative overflow-y-auto scrollbar",
            currentFont
          )}
        >
          <div>
            <ul className="flex flex-col gap-2">
              {soundscapes.map((sound, index) => (
                <li
                  key={index}
                  onClick={() =>
                    playSound(
                      sound.url,
                      sound.volume,
                      sound.name,
                      sound.image,
                      sound.index
                    )
                  }
                  className="select-none cursor-pointer"
                >
                  <b>{sound.name}</b>
                  <br />
                  {sound.attribution.map((attribution, index) => (
                    <div
                      key={index}
                      className="text-sm text-gray-500 dark:text-gray-300"
                    >
                      {attribution}
                      <br />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
            <br />
            <a href="https://noisefill.com/">
              {chrome.i18n.getMessage("from_noisefill")}
            </a>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default App;
