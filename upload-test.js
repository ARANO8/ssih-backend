const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const uploadTest = async () => {
  try {
    const form = new FormData();
    form.append('pacienteId', 'e0d7448c-2d50-4443-bf90-a1a28e7cd5af');
    form.append('subidoPor', 'test-user');
    form.append('categoria', 'documento-prueba');
    form.append('archivo', fs.createReadStream('C:\\temp\\test-document.txt'), 'test-document.txt');

    const response = await axios.post('http://localhost:3000/almacenamiento/archivos', form, {
      headers: form.getHeaders(),
      timeout: 10000,
      validateStatus: () => true  // Aceptar todas las respuestas
    });

    console.log('✓ Status:', response.status);
    if (response.status >= 400) {
      console.error('✗ Error Response:', response.data);
      process.exit(1);
    }
    console.log('✓ Respuesta:', JSON.stringify(response.data, null, 2));
    
    if (response.data.id) {
      console.log('\n✓ Archivo subido exitosamente!');
      console.log('  ID:', response.data.id);
      console.log('  Clave Objeto:', response.data.claveObjeto);
      console.log('  SHA256:', response.data.sha256);
    }
  } catch (error) {
    if (error.response) {
      console.error('✗ Error:', error.response.status, error.response.data);
    } else {
      console.error('✗ Error:', error.message);
    }
    process.exit(1);
  }
};

uploadTest();
