import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import { ip } from 'constants/ip';
import dayjs from 'dayjs';





const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  maxHeight: "90vh",
    overflowY: "auto",
};

const Categorie = {
    Toner: "Toner",
    DisqueStoquage: "DisqueStockage", 
    Clavier: "Clavier", 
    Souris: "Souris", 
    FlashDisque: "FlashDisque", 
    CarteGraphique: "CarteGraphique", 
    Ram: "Ram", 
    DisqueDur: "DisqueDur", 
    CartoucheEncre: "CartoucheEncre", 
    Autres: "Autres" 
    
}
  


const ModalStock = ({ open, handleClose, editItem }) => {
    const [stocks, setStocks] = useState([]);

  const [formData, setFormData] = useState({
    refArt: "",
    categorie: "",
    marque: "",
    modele: "",
    prix: "",
    quantiteStock: 0,
    capaciteToner: null,
    compatibiliteToner: "",
    couleurToner: null,
    capaciteFlashDvdCdRamHDD: 0,
    typeDisqueStoquage: null,
    typeConnexionClavierSouris: null,
    dispositionToucheClavier: null,
    nombreBouttonSouris: null,
    memoireCarteGraphiqueRam: null,
    IntefaceCarteGraphique: null,
    frequenceCarteGraphiqueRam: null,
    typeRam: "",
    interFaceHDD: null,
    vitesseHDD: null,
    tailleHDD: null,
    TypeHDD: null,
    autre: "",
  });

  useEffect(() => {
    if (editItem) {
      setFormData(editItem);
    }
  }, [editItem]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const stockToSave={
        ...formData,
        prix:parseFloat(formData.prix),
        quantiteStock:parseInt(formData.quantiteStock),
        capaciteToner:parseInt(formData.capaciteToner),
        capaciteFlashDvdCdRamHDD:parseInt(formData.capaciteFlashDvdCdRamHDD),

    }
    if (editItem) {
        // @ts-ignore
        const {Alimentation, ...rest}=stockToSave;
      axios
        .patch(`${ip}/stocks/${stockToSave.refArt}`, rest)
        .then((response) => {
            setStocks(
                stocks.map((stock)=>
                stock.refArt === stockToSave.refArt
            ? response.data
            :stock
                )
            );
          handleClose();
        })
        .catch((error) => console.error('Error updating stock:', error));
    } else {
      axios.post(ip+'/stocks', stockToSave)
        .then((response) => {
            setStocks([...stocks,response.data]);
          handleClose();
        })
        .catch((error) => {
            console.error('Error Ajout stock:', error);
        });
    }
  };

  const isTonerCategory = formData.categorie === 'Toner';
  const isDisqueStoquageCategory = formData.categorie === 'DisqueStoquage';
  const isClavierCategory = formData.categorie === 'Clavier';
  const isSourisCategory = formData.categorie === 'Souris';
  const isFlashDisqueCategory = formData.categorie === 'FlashDisque';
  const isCarteGraphiqueCategory = formData.categorie === 'CarteGraphique';
  const isRamCategory = formData.categorie === 'Ram';
  const isDisqueDurCategory = formData.categorie === 'DisqueDur';
  const isCartoucheEncreCategory = formData.categorie === 'CartoucheEncre';
  const isAutresCategory = formData.categorie === 'Autres';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box sx={style}>
        <h2 id="modal-title">{editItem ? 'Éditer' : 'Ajouter'} Article</h2>
        
        <TextField
          select
          label="Catégorie"
          name="categorie"
          value={formData.categorie}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {Object.values(Categorie).map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </TextField>
        
        <TextField
          name="refArt"
          label="Référence"
          value={formData.refArt}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={!!editItem}
        />
        <TextField
          name="marque"
          label="Marque"
          value={formData.marque}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="modele"
          label="Modèle"
          value={formData.modele}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="prix"
          label="Prix"
          value={formData.prix || ""}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        <TextField
          name="quantiteStock"
          label="Quantité en Stock"
          value={formData.quantiteStock}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
        />
        {isTonerCategory && (
          <>
            <TextField
              name="capaciteToner"
              label="Capacité Toner"
              value={formData.capaciteToner}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="compatibiliteToner"
              label="Compatibilité Toner"
              value={formData.compatibiliteToner}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            
            <TextField
            select
              name="couleurToner"
              label="Couleur Toner"
              value={formData.couleurToner || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {[  null,
                    "NOIR",
                    "COULEUR",
                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}

            </TextField>


          </>
        )}
        {isDisqueStoquageCategory && (
          <>
            <TextField
              name="capaciteFlashDvdCdRamHDD"
              label="Capacité"
              value={formData.capaciteFlashDvdCdRamHDD}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />   
            <TextField
            select
              name="typeDisqueStoquage"
              label="Type Disque de Stockage"
              value={formData.typeDisqueStoquage || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                 {[
                    "CD",
                    "DVD",
                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}

            </TextField>
             </>)}
             {isClavierCategory && (
             <>           
            <TextField
            select
              name="typeConnexionClavierSouris"
              label=" Connexion "
              value={formData.typeConnexionClavierSouris || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {[
                    "USb",
                    "WIFI",
                    "BLUETOOTH",                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
            select
              name="dispositionToucheClavier"
              label="Disposition Touche Clavier"
              value={formData.dispositionToucheClavier || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                 {[
                    "AZERTY",
                    "QWERTY",
                  ].map((disposition) => (
                    <MenuItem key={disposition} value={disposition}>
                      {disposition}
                    </MenuItem>
                  ))}
            </TextField>
            </>)}
            {isSourisCategory && (
             <>
             <TextField
            select
              name="typeConnexionClavierSouris"
              label="Connexion"
              value={formData.typeConnexionClavierSouris || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {[
                    "USb",
                    "WIFI",
                    "BLUETOOTH",                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
              name="nombreBouttonSouris"
              label="Nombre Bouton Souris"
              value={formData.nombreBouttonSouris}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            /> 
</>)}

{isFlashDisqueCategory && (
             <>
             <TextField
              name="capaciteFlashDvdCdRamHDD"
              label="Capacité"
              value={formData.capaciteFlashDvdCdRamHDD}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />           
            </>)}

{isCarteGraphiqueCategory && (
             <>
            <TextField
              name="memoireCarteGraphiqueRam"
              label="Mémoire Carte Graphique"
              value={formData.memoireCarteGraphiqueRam}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="IntefaceCarteGraphique"
              label="Interface Carte Graphique"
              value={formData.IntefaceCarteGraphique}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="frequenceCarteGraphiqueRam"
              label="Fréquence Carte Graphique"
              value={formData.frequenceCarteGraphiqueRam}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            </>)}
           {isRamCategory && (
<>
<TextField
              name="memoireCarteGraphiqueRam"
              label="Mémoire"
              value={formData.memoireCarteGraphiqueRam}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              name="typeRam"
              label="Type Ram"
              value={formData.typeRam}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="frequenceCarteGraphiqueRam"
              label="Fréquence"
              value={formData.frequenceCarteGraphiqueRam}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
             </>)}             
             {isDisqueDurCategory && (
                <>
<TextField
              name="capaciteFlashDvdCdRamHDD"
              label="Capacité"
              value={formData.capaciteFlashDvdCdRamHDD}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
            select
              name="interFaceHDD"
              label="Interface HDD"
              value={formData.interFaceHDD || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"            
            >
                {[
                    "SATA",
                    "USB",
                    "PCIe",                    
                    "IDE",                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
              name="vitesseHDD"
              label="Vitesse HDD"
              value={formData.vitesseHDD}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
            select
              name="tailleHDD"
              label="Taille HDD"
              value={formData.tailleHDD || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {[
                    "2.5",
                    "3.5",
                    "M2",                    
                  ].map((type) => (
                    <MenuItem key={type} value={type} >
                      {type}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
            select
              name="TypeHDD"
              label="Type Disque Dur"
              value={formData.TypeHDD || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
              >
                {["HDD","SSD","SSHD"].map((type)=>(
                    <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            
  </>)}
  {isCartoucheEncreCategory && (
                <>
            <TextField
            select
              name="couleurToner"
              label="Couleur Cartouche"
              value={formData.couleurToner || ""}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {["NOIR","COULEUR"].map((type)=>(
                    <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>

          </>
        )}


  {isAutresCategory && (
                <>
            <TextField
              name="autre"
              label="Autres"
              value={formData.autre}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
          </>
        )}
        
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editItem ? 'Éditer' : 'Ajouter'}
        </Button>
      </Box>
    </Modal>
  );
};

export default ModalStock;
