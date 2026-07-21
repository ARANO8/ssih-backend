import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { RolModule } from './seguridad/rol/rol.module';
import { PermisoModule } from './seguridad/permiso/permiso.module';
import { UsuarioModule } from './seguridad/usuario/usuario.module';
import { PersonaModule } from './maestros/persona/persona.module';
import { PacienteModule } from './maestros/paciente/paciente.module';
import { EmpleadoModule } from './maestros/empleado/empleado.module';
import { MedicoModule } from './maestros/medico/medico.module';
import { EspecialidadModule } from './maestros/especialidad/especialidad.module';
import { ConsultorioModule } from './maestros/consultorio/consultorio.module';
import { HistoriaClinicaModule } from './clinica/historia-clinica/historia-clinica.module';
import { EpisodioAtencionModule } from './clinica/episodio-atencion/episodio-atencion.module';
import { CitaModule } from './clinica/cita/cita.module';
import { ConsultaModule } from './clinica/consulta/consulta.module';
import { SignoVitalModule } from './clinica/signo-vital/signo-vital.module';
import { DiagnosticoModule } from './clinica/diagnostico/diagnostico.module';
import { MedicamentoModule } from './farmacia/medicamento/medicamento.module';
import { ProveedorModule } from './farmacia/proveedor/proveedor.module';
import { CompraModule } from './farmacia/compra/compra.module';
import { RecetaModule } from './farmacia/receta/receta.module';
import { DispensacionModule } from './farmacia/dispensacion/dispensacion.module';
import { OrdenLaboratorioModule } from './laboratorio/orden-laboratorio/orden-laboratorio.module';
import { MuestraModule } from './laboratorio/muestra/muestra.module';
import { OrdenImagenologiaModule } from './imagenologia/orden-imagenologia/orden-imagenologia.module';
import { ServicioModule } from './facturacion/servicio/servicio.module';
import { FacturaModule } from './facturacion/factura/factura.module';
import { PagoModule } from './facturacion/pago/pago.module';

@Module({
  imports: [
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        prismaOptions: {
          adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
        },
      },
    }),
    RolModule,
    PermisoModule,
    UsuarioModule,
    PersonaModule,
    PacienteModule,
    EmpleadoModule,
    MedicoModule,
    EspecialidadModule,
    ConsultorioModule,
    HistoriaClinicaModule,
    EpisodioAtencionModule,
    CitaModule,
    ConsultaModule,
    SignoVitalModule,
    DiagnosticoModule,
    MedicamentoModule,
    ProveedorModule,
    CompraModule,
    RecetaModule,
    DispensacionModule,
    OrdenLaboratorioModule,
    MuestraModule,
    OrdenImagenologiaModule,
    ServicioModule,
    FacturaModule,
    PagoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
