import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';

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

const categories = [
  { value: 'Toner', label: 'Toner' },
  { value: 'DisqueStoquage', label: 'Disque de Stockage' },
  { value: 'Clavier', label: 'Clavier' },
  { value: 'Souris', label: 'Souris' },
  { value: 'FlashDisque', label: 'Flash Disque' },
  { value: 'CarteGraphique', label: 'Carte Graphique' },
  { value: 'Ram', label: 'Ram' },
  { value: 'DisqueDur', label: 'Disque Dur' },
  { value: 'CartoucheEncre', label: 'Cartouche d’Encre' },
  { value: 'Autres', label: 'Autres' },
];

const ModalStock = ({ open, handleClose, editItem }) => {
  const [formData, setFormData] = useState({
    refArt: '',
    categorie: 'Autres',
    marque: '',
    modele: '',
    prix: 0,
    quantiteStock: 0,
    capaciteToner: null,
    compatibiliteToner: '',
    dateExpirationToner: '',
    couleurToner: '',
    capaciteFlashDvdCdRamHDD: null,
    typeDisqueStoquage: '',
    typeConnexionClavierSouris: '',
    dispositionToucheClavier: '',
    nombreBouttonSouris: null,
    memoireCarteGraphiqueRam: null,
    IntefaceCarteGraphique: '',
    frequenceCarteGraphiqueRam: null,
    typeRam: '',
    interFaceHDD: '',
    vitesseHDD: null,
    tailleHDD: '',
    TypeHDD: '',
    autre: ''
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
    if (editItem) {
      axios.put(`/api/stocks/${formData.refArt}`, formData)
        .then(() => {
          handleClose();
        })
        .catch((error) => console.error('Error updating stock:', error));
    } else {
      axios.post('/api/stocks', formData)
        .then(() => {
          handleClose();
        })
        .catch((error) => console.error('Error adding stock:', error));
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
          name="categorie"
          label="Catégorie"
          value={formData.categorie}
          onChange={handleChange}
          select
          fullWidth
          margin="normal"
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
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
          value={formData.prix}
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
              name="dateExpirationToner"
              label="Date Expiration Toner"
              value={formData.dateExpirationToner}
              onChange={handleChange}
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="couleurToner"
              label="Couleur Toner"
              value={formData.couleurToner}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
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
              value={formData.typeDisqueStoquage}
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
              value={formData.typeConnexionClavierSouris}
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
              value={formData.dispositionToucheClavier}
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
              value={formData.typeConnexionClavierSouris}
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
              value={formData.interFaceHDD}
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
              value={formData.tailleHDD}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
                {[
                    "2.5",
                    "3.5",
                    "M2",                    
                  ].map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
            </TextField>
            <TextField
            select
              name="TypeHDD"
              label="Type Disque Dur"
              value={formData.TypeHDD}
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
              value={formData.couleurToner}
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
