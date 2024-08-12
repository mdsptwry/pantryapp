"use client"
import { Box, Stack, Typography, Button, Modal, TextField, IconButton} from "@mui/material";
import { firestore } from "@/firebase";
import {collection, query, getDocs, doc, setDoc, deleteDoc, getDoc, count} from 'firebase/firestore'
import { useEffect, useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { ST } from "next/dist/shared/lib/utils";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,

};

export default function Home() {
  const [pantry, setPantry] = useState([])
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const [showMessage, setShowMessage] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // const addItem = async (item) => {
  //   const docRef = doc(collection(firestore, 'pantry'), item)
    
  //   await setDoc(docRef, {})
  //   await updatePantry()
  // }
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      const data = docSnap.data();
      const newCount = (data.count || 0) + 1; // Increment count
      await setDoc(docRef, { count: newCount }); // Update count
    } else {
      await setDoc(docRef, { count: 1 }); // Set count to 1 if item is new
    }
    await updatePantry(); // Refresh the pantry list

    console.log('Adding item: ${name}');
    setShowMessage(true);
  };
  

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const {count} = docSnap.data()
      if (count === 1){
        await deleteDoc(docRef)
      } else{
        await setDoc(docRef, {count: count - 1})
      }
    }
    await updatePantry()
  }

  const deleteItem = async(item) => {
    const docRef = doc(collection(firestore, 'pantry'), item);
    await deleteDoc(docRef)
    await updatePantry();
  }


  const updatePantry = async () => {
    const snapshot = query(collection(firestore, 'pantry'))
    const docs = await getDocs(snapshot)
    const pantryList = []
    docs.forEach((doc)=> {
      pantryList.push({name: doc.id, ... doc.data()})
   })
     console.log(pantryList)
     setPantry(pantryList)
  }

  useEffect( ()=> {
    updatePantry()
  }, [])

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 1500); // Hide the message after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const filteredPantry = pantry.filter(({name}) => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return ( 
  <Box 
    width="100vw" 
    height="50vw"
    display={"flex"}
    justifyContent={"center"}
    flexDirection={'column'}
    alignItems={"center"}
    gap={2}
  >
     {/* Title */}
  <Typography 
    variant="h4"        // Adjust the variant for the size you want
    color="primary"     // You can set the color to primary or any custom color
    //gutterBottom 
    marginTop={3}
  >
    My Pantry Tracker
  </Typography>

  {/* Description */}
  <Typography 
    variant="body1"     // Body1 is a standard paragraph text; you can adjust this
    color="textSecondary"  // Subtle color for the description
    align="center"      // Align text to center
    paragraph           // Adds space below the description
  >
    Keep track of your pantry items with ease. Add, remove, and search for items in your pantry.
  </Typography>


    {/* model */}
    <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Items
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField 
              id="outline-basic" 
              label="Item" 
              variant="outlined" 
              value={itemName}
              onChange={(e)=> setItemName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter'){
                  addItem(itemName)
                  setItemName('')
                }
              }}
            />
            {showMessage && (
              <Typography 
                variant="body2" 
                color="green"
                sx={{ marginTop: 1 }}
              >
                Item added
              </Typography>
            )}
            <Button variant="contained"
            onClick={() => {
              addItem(itemName)
              setItemName('')
            }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>

    <Button variant="contained"
    onClick={handleOpen}
    sx={{
      backgroundColor: "#333",
      color: "whitesmoke",
      '&:hover': {
        backgroundColor: 'black'
      }
    }}
    >Add Items</Button>

    {/* search bar implementation */}
    <TextField 
      variant="outlined"
      placeholder="Search Items"
      sx={{width: '600px', 
        border: '1px solid',
        borderRadius: 1.5
      }}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
   
    {/* if item doesn't exist in search */}
    {filteredPantry.length === 0 && searchTerm && (
      <Typography
      variant="h9"
      color={'red'}>
        Sorry, item does not exist.
      </Typography>
    )}

    <Box 
      border={'1px solid #333'}
    >
    <Box 
      width="800px"  
      height="100px" 
      bgcolor={'#CEEC85'}
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      border={'1px solid #333'}
    >
      <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
      Inventory
      </Typography>
    </Box>
    <Stack 
      width="800px" 
      height="330px"
      spacing={2}
      overflow={'auto'}
      boxShadow={10}
    >
      {filteredPantry.map(({name, count}) => (
        <Box
        key={name}
        width="100%"
        minHeight="100px"
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bgcolor={'snow'}
        padding={5}
        boxShadow={2}
        >
          <Typography
            variant={'h3'}
            color={'#333'}
            textAlign={'center'}
          >
          {
            // Capitalize
            name.charAt(0).toUpperCase()+name.slice(1)
          }
          </Typography>


        <Stack direction={"row"} spacing={2}>

        <AddCircleOutlineIcon 
            onClick={() => addItem(name)} 
            sx={{ fontSize: 30, cursor: 'pointer', color: 'green' }}
          />
        <Typography 
          variant={'h5'} 
          color={'#333'}
          alignItems={'center'}
          >
            Qty: {count}      
          </Typography>

          <RemoveCircleOutlineIcon 
            onClick={() => removeItem(name)} 
            sx={{ fontSize: 30, cursor: 'pointer', color: 'blue' }}
          />

        <IconButton 
         color="error"
         onClick={() => deleteItem(name)}
        >
          <DeleteIcon  />
        </IconButton>
        </Stack>
        </Box>
      ))}
    </Stack>
    </Box>
  </Box>
  )
}
