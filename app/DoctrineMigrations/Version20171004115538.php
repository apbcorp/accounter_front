<?php

namespace Application\Migrations;

use Doctrine\DBAL\Migrations\AbstractMigration;
use Doctrine\DBAL\Schema\Schema;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
class Version20171004115538 extends AbstractMigration
{
    /**
     * @param Schema $schema
     */
    public function up(Schema $schema)
    {
        $this->addSql('
            CREATE TABLE `document_meter` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
            CREATE TABLE `document_meter_row` (
            `id` INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            `document_id` INT(11) UNSIGNED DEFAULT NULL,
            `meter_id` INT(11) UNSIGNED DEFAULT NULL,
            `start_value` DECIMAL(11,3) NOT NULL DEFAULT 0,
            `end_value` DECIMAL(11,3) NOT NULL DEFAULT 0,
            `created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `updated` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            `deleted` INT(1) UNSIGNED NOT NULL DEFAULT 0
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
        ');
    }

    /**
     * @param Schema $schema
     */
    public function down(Schema $schema)
    {
        $this->addSql('
            DROP TABLE `document_meter`;
            DROP TABLE `document_meter_row`;
        ');
    }
}
