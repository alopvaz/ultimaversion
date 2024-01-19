-- CreateTable
CREATE TABLE `Participantes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `contrasena` VARCHAR(191) NOT NULL,
    `rol` ENUM('user', 'admin') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sesiones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `fecha` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tareas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `estimacion` INTEGER NOT NULL,
    `sesionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Votaciones` (
    `participanteId` INTEGER NOT NULL,
    `tareaId` INTEGER NOT NULL,
    `votacion` INTEGER NOT NULL,

    PRIMARY KEY (`participanteId`, `tareaId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tareas` ADD CONSTRAINT `Tareas_sesionId_fkey` FOREIGN KEY (`sesionId`) REFERENCES `Sesiones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Votaciones` ADD CONSTRAINT `Votaciones_participanteId_fkey` FOREIGN KEY (`participanteId`) REFERENCES `Participantes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Votaciones` ADD CONSTRAINT `Votaciones_tareaId_fkey` FOREIGN KEY (`tareaId`) REFERENCES `Tareas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
