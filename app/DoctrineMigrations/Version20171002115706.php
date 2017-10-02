<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171002115706 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE `user` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `login` VARCHAR(255) NOT NULL UNIQUE ,
            `password` VARCHAR(255) NOT NULL,
            `salt` VARCHAR(255) NOT NULL,
            `active` INT(1) UNSIGNED NOT NULL DEFAULT 1
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `user`;
        ');
    }
}
