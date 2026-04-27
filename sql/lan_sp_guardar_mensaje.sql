CREATE OR ALTER PROCEDURE dbo.lan_sp_guardar_mensaje
    @Nombre     NVARCHAR(150),
    @Empresa    NVARCHAR(150) = NULL,
    @Correo     NVARCHAR(150),
    @Telefono   NVARCHAR(50) = NULL,
    @Asunto     NVARCHAR(200),
    @Mensaje    NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO dbo.lan_mensajes
    (
        Nombre,
        Empresa,
        Correo,
        Telefono,
        Asunto,
        Mensaje
    )
    VALUES
    (
        LTRIM(RTRIM(@Nombre)),
        NULLIF(LTRIM(RTRIM(@Empresa)), N''),
        LTRIM(RTRIM(@Correo)),
        NULLIF(LTRIM(RTRIM(@Telefono)), N''),
        LTRIM(RTRIM(@Asunto)),
        LTRIM(RTRIM(@Mensaje))
    );

    DECLARE @IdMensaje INT = SCOPE_IDENTITY();

    SELECT
        IdMensaje,
        Nombre,
        Empresa,
        Correo,
        Telefono,
        Asunto,
        Mensaje,
        FechaRegistro,
        Estado
    FROM dbo.lan_mensajes
    WHERE IdMensaje = @IdMensaje;
END;
GO
