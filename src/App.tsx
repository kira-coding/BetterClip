import { useEffect, useState } from "react";
// import { invoke } from "@tauri-apps/api/core";

import { startListening, onClipboardChange, stopListening, writeFiles, writeImage, writeText } from "tauri-plugin-clipboard-x-api";
import Database from '@tauri-apps/plugin-sql';
import Search from "../components/Search";
import Filter from "../components/Filter";
import { AiOutlineFileUnknown } from "react-icons/ai";
import { FaImage } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { FaThumbtack } from "react-icons/fa6"
import { FaClipboardList } from "react-icons/fa";
import { FaRegFile } from "react-icons/fa6";
import { AiOutlineClear } from "react-icons/ai";
import { BsIncognito } from "react-icons/bs";
import { convertFileSrc } from "@tauri-apps/api/core";
import { MdDeleteForever } from "react-icons/md";
import { RiUnpinFill } from "react-icons/ri";
import { enable, isEnabled, disable } from '@tauri-apps/plugin-autostart';


function App() {
  const [term, setTerm] = useState("")
  const [filter, setFilter] = useState("All")
  const [clipboard, setClipboard] = useState<any>([])
  const [filteredBoard, setFilteredBoard] = useState<any>([])
  const [incognito, setIncognito] = useState(false)
  const [clear, setClear] = useState(false)
  const [selectedData, setSelectedData] = useState<any>()
  const [mode, setMode] = useState("")
  const [pin, setPin] = useState(false)
  const [autoStart, setAutoStart] = useState(true)
  useEffect(() => {
    let listenToClipboard = async () => {
      // await startListening();
      const db = await Database.load('sqlite:betterClip1.db');
      let data: Array<any> = await db.select("SELECT * from clipboard ORDER BY datetime DESC");
      // TODO: Check the age of each data and delete old once
      let young_data = data.filter((value) => {
        let birth_moment = Date.parse(value.datetime)
        let now = Date.now()
        if (now < birth_moment + 2592000000) {
          return true
        } else {
          db.execute("DELETE FROM clipboard WHERE id= $1", [value.id]).then(() => {
            console.log("delete was a success")
          })
        }

      })
      setClipboard(young_data)
      await onClipboardChange(async (change) => {
        const datetime = new Date().toISOString();
        if (change.image) {

          db.execute("INSERT INTO clipboard (type, datetime, value) values ($1, $2, $3)", ["image", datetime.toString(), change.image?.value]).then(
            async () => {
              young_data = await db.select("SELECT * from clipboard ORDER BY datetime DESC");
              setClipboard(young_data)
            }
          )
        }
        else if (change.files) {

          db.execute("INSERT INTO clipboard (type, datetime, value) values ($1, $2, $3)", ["file", datetime.toString(), change.files?.value]).then(
            async () => {
              young_data = await db.select("SELECT * from clipboard ORDER BY datetime DESC");
              setClipboard(young_data)
            }
          )

        }
        else if (change.text) {
          if (change.text.value.startsWith("http://") || change.text.value.startsWith("https://")) {
            await db.execute("INSERT INTO clipboard (type, datetime, value) values ($1, $2, $3)", ["link", datetime.toString(), change.text?.value]).then(
              async () => {
                young_data = await db.select("SELECT * from clipboard ORDER BY datetime DESC");
                setClipboard(young_data)
              }
            )
          } else {
            await db.execute("INSERT INTO clipboard (type, datetime, value) values ($1, $2, $3)", ["text", datetime.toString(), change.text?.value]).then(
              async () => {
                young_data = await db.select("SELECT * from clipboard ORDER BY datetime DESC");
                setClipboard(young_data)
              }
            )
          }

        }


      });

      // To stop listening at a later point, you can call unlisten()
      // unlisten();
    }
    let manageAutostart = async () => {
      let start = await isEnabled()
      setAutoStart(start)
    }
    listenToClipboard();
    manageAutostart()
  }, [])

  useEffect(() => {
    const Delete = async () => {
      const db = await Database.load('sqlite:betterClip1.db');
      await db.execute("DELETE from clipboard WHERE id=$1", [selectedData.id])
      let data: Array<any> = await db.select("SELECT * from clipboard ORDER BY datetime DESC");

      setClipboard(data)
    }
    const StartUp = async () => {
      if (autoStart) {
        await enable()
      }
      else {
        await disable()
      }
    }
    const Pin = async () => {
      const db = await Database.load('sqlite:betterClip1.db');
      let invert_pin = true
      if (selectedData.pin == "true") { invert_pin = false }

      await db.execute("UPDATE  clipboard SET pin=$2 WHERE id=$1", [selectedData.id, invert_pin])
      let data: Array<any> = await db.select("SELECT * from clipboard ORDER BY datetime DESC");

      setClipboard(data)
    }
    const Copy = async () => {
      if (selectedData.type == "text"|| selectedData.type=="link") {
        await writeText(selectedData.value)
      }
      else if (selectedData.type == "image") {
        await writeImage(selectedData.value)
      }
      else if (selectedData.type == "file") {

        await writeFiles(JSON.parse(selectedData.value))
      }
    }
    if (mode == "Delete") {
      Delete()
      setMode("")
    }
    else if (mode == "Pin") {
      Pin()
      setMode("")
    }
    else if (mode == "Copy") {

      Copy()
      setMode("")
    }
    else if (mode == "Startup") {
      StartUp()
      setMode("")
    }

  }, [mode])
  useEffect(() => {
    let clearDatabase = async () => {
      if (clear == true) {
        const db = await Database.load('sqlite:betterClip1.db');
        db.execute("DELETE from clipboard")
        setClipboard([])
      }


    }
    clearDatabase()
  }, [clear])


  useEffect(() => {
    const listen = async () => {
      if (incognito) {
        await stopListening()
      }
      else {
        startListening()
      }
    }
    listen()

  }, [incognito])
  useEffect(() => {
    function search() {
      let x: any = []
      if (filter == "All" && term == "") {
        x = clipboard
      }
      else if (term != "" && filter != "All") {
        clipboard.forEach((element: any) => {
          if (element.type == filter) {
            (element.value.match(term)) ? x.push(element) : null;
          }

        }
        )
      }
      else if (filter == "All" && term != "") {
        clipboard.forEach((element: any) => {

          (element.value.match(term)) ? x.push(element) : null;

        });
      }
      else if (filter != "All" && term == "") {
        clipboard.forEach((element: any) => {
          (element.type == filter) ? x.push(element) : null;

        });
      }
      console.log(filteredBoard)
      setFilteredBoard(x)
    }
    search()

  }, [filter, clipboard, term])
  return (
    <>
      <div className="inline-flex  items-center absolute top-2 right-7 w-28 mb-4">

        <label className="flex items-center cursor-pointer relative">
          <input onChange={() => {
            setAutoStart(!autoStart)
            setMode("Startup")
          }} type="checkbox"  checked={autoStart}  className="peer h-5 w-5 cursor-pointer transition-all appearance-none rounded shadow hover:shadow-md border border-slate-300 checked:bg-slate-800 checked:border-slate-800" id="check" />
          <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" stroke-width="1">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
            </svg>
          </span>
        </label>

        <label htmlFor="check" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Auto-Start</label>
      </div>
      <main className="bg-tone w-screen  text-primary   min-h-screen flex font-roboto  flex-col justify-start items-start pl-8 pt-12">
        <div className="flex w-5/6   justify-between items-baseline">
          <Search setTerm={setTerm} term={term} />
          <h1 className="text-4xl p-0 m-0 flex "><FaClipboardList /> BetterClip</h1>

        </div>
        <hr className="w-5/6 m-1 " />
        <div className="flex w-5/6   justify-between items-baseline">

          <Filter setFilter={setFilter} filter={filter} />
          <div>
            <button type="button" onClick={(e) => {
              e.preventDefault()
              setPin(!pin)
            }} className={(pin ? " bg-cyan-800" : " bg-secondary ") + "outline-none border-none py-2 px-2 rounded-md font-bold mx-2"}><FaThumbtack ></FaThumbtack></button>
            <button type="button" className="outline-none border-none py-2 px-4 bg-secondary text-cyan-800 rounded-md font-bold mx-2 ml-0" onClick={() => {
              setClear(true)
            }}><AiOutlineClear />
            </button>
            <button type="button" onClick={() => {
              setIncognito(!incognito)
            }} className={!incognito ? "outline-none  bg-secondary text-cyan-800  border-none py-2 px-4 rounded-md font-bold " : "outline-none  bg-primary text-cyan-800  border-none py-2 px-4 rounded-md font-bold "}><BsIncognito /></button>
          </div>
        </div>
        {filteredBoard.map((data: any, index: number) => {
          let type = data.type
          let pinned = false;
          if (data.pin == "true") pinned = true
          let Delete = () => {
            return <button id={data.id} onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedData(data)
              setMode("Delete")
            }} className={"text-primary absolute top-0 right-1  w-6 h-5 flex justify-center text-center rounded-b-md bg-red-900 hover:bg-slate-700 transition-colors"}><MdDeleteForever /></button>;
          }
          let Pin = () => {
            return <button id={data.id} onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setSelectedData(data)
              setMode("Pin")

            }} className={(pinned ? " bg-slate-200 text-accent" : "text-primary bg-violet-900") + " absolute top-0 right-16 flex justify-center w-6 h-5 text-center rounded-b-md  hover:bg-green-800 transition-colors"}>{pinned ? <RiUnpinFill></RiUnpinFill> : < FaThumbtack />}</button>;
          }
          let color = ""
          let Content = null
          let Tag = null
          switch (type) {
            case "text":
              {
                color = "bg-green-700"
                Tag = () => <span className={"text-primary absolute top-0 left-1  w-12 h-5 text-center rounded-b-md " + color}>{type}</span>;
                Content = () => <p>{data.value}</p>
                break

              };
            case "image": {
              color = "bg-orange-700"
              Tag = () => <h4 className={"text-primary absolute flex items-center justify-center top-0 left-1 w-24 h-5 text-center rounded-b-lg " + color}> <FaImage /> {type}</h4>
              Content = () => <img className={"w-1/4 "} src={convertFileSrc(data.value)} alt={convertFileSrc(data.value)} />
              break
            }

            case "file": {
              color = "bg-yellow-700"
              Tag = () => <span className={"text-primary absolute top-0 left-1  flex items-center justify-center w-12 h-5 text-center rounded-b-md " + color}><FaRegFile />{type}</span>;
              let file_name = JSON.parse(data.value)
              Content = () => <p> <span className="bg-slate-500 p-1 rounded-md my-4 ">File name</span>: {file_name.join("\n")}</p>
              break
            };
            case "link": {
              color = "bg-cyan-700";
              Tag = () => <span className={"text-primary absolute top-0 left-1  w-12 h-5 text-center rounded-b-md " + color}> <FaLink /> {type}</span>;
              Content = () => <p>{data.value}</p>
              break
            }
            default: {
              color = "bg-black"
              Tag = () => <span className={"text-primary absolute top-0 left-1  w-12 h-5 text-center rounded-b-md " + color}> <AiOutlineFileUnknown /> {type}</span>;
              Content = () => <p>{data.value}</p>

            }
          }
          if (pin && pinned || !pin) {
            return (
              <button key={index} onClick={() => {
                setSelectedData(data)
                setMode("Copy")
              }} className={"p-4 w-11/12 min-h-8 relative overflow-x-scroll max-h-80 bg-accent rounded-lg m-2"}>
                <Tag></Tag>
                <Content></Content>
                <Pin></Pin>
                <Delete></Delete>
              </button>)
          }
        })}

      </main>
    </>
  );
}
export default App;
