IF OBJECT_ID('dbo.lan_mensajes', 'U') IS NOT NULL
BEGIN
    DROP TABLE dbo.lan_mensajes;
END;
GO

CREATE TABLE dbo.lan_mensajes
(
    IdMensaje       INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre          NVARCHAR(150) NOT NULL,
    Empresa         NVARCHAR(150) NULL,
    Correo          NVARCHAR(150) NOT NULL,
    Telefono        NVARCHAR(50) NULL,
    Asunto          NVARCHAR(200) NOT NULL,
    Mensaje         NVARCHAR(MAX) NOT NULL,
    FechaRegistro   DATETIME2(0) NOT NULL CONSTRAINT DF_lan_mensajes_FechaRegistro DEFAULT SYSUTCDATETIME(),
    Estado          NVARCHAR(20) NOT NULL CONSTRAINT DF_lan_mensajes_Estado DEFAULT N'NUEVO'
);
GO
